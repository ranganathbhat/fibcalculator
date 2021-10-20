const keys = require('./keys');

// express app setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors()).use(bodyParser.json());

// Postgres Client setup
const { Pool } = require('pg');
const pgCli = new Pool({
    user : keys.pgUser,
    password : keys.pgPwd,
    database : keys.pgDatabase,
    host : keys.pgHost,
    port : keys.pgPort
});
pgCli.on('error',() => console.log('Lost PG Connections.'));
pgCli.query('CREATE TABLE IF NOT EXISTS VALUES (number INT)')
    .catch(err=>console.log("error:"+err));

// Redis Client Setup
const redis = require('redis');
const redisCli = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy : () => 1000 
    // if redis connection lost, then retry after 1000ms
});
const redisPublish = redisCli.duplicate();

// Express Route Handlers
app.get('/', (req, res) => {
    res.send('Hi');
});
app.get('/values/all', async (req, res) => {
    const values = await pgCli.query('SELECT * from values');
    res.send(values.rows);
});
app.get('/values/current', async (req, res) => {
    redisCli.hgetall('values', (err, values) => {
        res.send(values);
        // used in callback function instead of await.
    });
});
app.post('/values', async (req, res) => { 
    const index = req.body.index;
    if(parseInt(index) > 40){
        return res.status(422).send('Index too high');
    }

    redisCli.hset('values', index, 'empty');
    redisPublish.publish('insert', index);
    pgCli.query('INSERT INTO values(number) VALUES($1)', [index]);
    res.send({working : true});
});

app.listen(5000, err => {
    console.log('Listening');
});