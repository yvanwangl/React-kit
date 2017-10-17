import React, {Component} from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import Home from './components/Home';
import Home1 from './components/Home1';
import indexImage from './images/index.png';
import configStore from './store/index';
import './index.css';

if(process.env.NODE_ENV == 'production'){
    console.log(process.env.NODE_ENV);
}

const store = configStore({});

class App extends Component {
    render(){
        return (
            <Provider store={store}>
                <Home />
            </Provider>
        );
    }
}

render(<App />, document.getElementById('root'));