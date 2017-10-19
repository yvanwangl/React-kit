import React, {Component} from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import Root from './container/Root';
import configStore from './store/index';
import './index.css';

if(process.env.NODE_ENV == 'production'){
    console.log(process.env.NODE_ENV);
}
console.log(window.__initialState__);

const initialState = window.__initialState__ || {};
const store = configStore(initialState);

class App extends Component {
    render(){
        return (
            <Provider store={store}>
                <Root />
            </Provider>
        );
    }
}

render(<App />, document.getElementById('root'));