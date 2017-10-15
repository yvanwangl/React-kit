import React, {Component} from 'react';
import {render} from 'react-dom';
import Home from './components/Home';
import Home1 from './components/Home1';
import indexImage from './images/index.png';
import './index.css';

if(process.env.NODE_ENV == 'production'){
    console.log(process.env.NODE_ENV);
}

class App extends Component {
    render(){
        return (
            <div className='hello'>
                <p>hello world!!!qssssaaasscccccccbbb</p>
                <Home />
                <Home1 />
                <img src={indexImage}/>
            </div>
        );
    }
}

render(<App />, document.getElementById('root'));