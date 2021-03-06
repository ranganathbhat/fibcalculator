import React from 'react';
import axios from 'axios';

class Fib extends React.Component{
    state = {
        //seenIndexes : [],
        values : {},
        index : ''
    };

    componentDidMount(){
        this.fetchValues();
        //this.fetchIndexes();
    }

    async fetchValues(){
        const values = await axios.get('/api/values/current');
        this.setState({values:values.data});
    }

    renderValues(){
        const entries = [];
        for(let key in this.state.values){
            entries.push(
                <div key={key}>
                    For index {key}, Fib value: {this.state.values[key]} 
                </div>
            );
        }

        return entries;
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/values', {index:this.state.index});
        this.setState({index:''});
    }

    render(){
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index: </label>
                    <input value={this.state.index} 
                        onChange={e=>this.setState({index:e.target.value})}
                    />
                    <button>Submit</button>
                </form>

                <h3>Calculated Values :</h3>
                {this.renderValues()}
            </div>
        );
    }
}

export default Fib;