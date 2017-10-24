import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {add, fetchBlogs} from '../action/blog';

class Home extends Component {
    constructor(props){
        super(props);
        this.index = 1;
    }

    static fetchData({ query, params, store, history }){
        return store.dispatch(fetchBlogs());
    };

    add = ()=>{
        let {dispatch} = this.props;
        dispatch({
            type: 'SUCCESS',
            payload: this.index++
        });
    };

    render(){
        let {blog} = this.props;
        return (
            <div>
                home page!{blog.blogs}
                <div onClick={this.add.bind(this)}>add</div>
            </div>
        );
    }
}
function mapStateToProps({blog}){
    return {blog};
}

export default connect(mapStateToProps)(Home);