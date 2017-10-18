import React, {Component} from 'react';
import routes from '../router';
import {Router, Route, browserHistory} from 'react-router';

export default class Root extends Component {
    render(){
        return (
            <Router routes={routes} history={browserHistory}/>
        );
    }
}