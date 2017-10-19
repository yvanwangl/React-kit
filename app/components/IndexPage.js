import React, {Component} from 'react';
import {Link} from 'react-router';

export default class IndexPage extends Component {
    render(){
        return (
            <div>
                <Link to='/user/3'>user</Link>
            </div>
        );
    }
}