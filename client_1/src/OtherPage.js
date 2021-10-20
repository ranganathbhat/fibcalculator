import React from 'react';
import { Link } from 'react-router-dom';

const OtherPage = ()=>{
    return (
        <div>
            In Some other page!!!
            <Link to="/">Go back to Home</Link>
        </div>
    );
}

export default OtherPage;
