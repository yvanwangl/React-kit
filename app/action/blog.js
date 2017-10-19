import {SUCCESS} from '../contants/blog';
import request from '../util/request';

export function add(value){
    return {
        type: SUCCESS,
        payload: value
    }
}


export function fetchBlogs(){
    return (dispatch)=>{
        return request('/blogs', {
            method: 'GET'
        }).then(data=> {
            dispatch({
                type: SUCCESS,
                payload: data.blogs
            });
            return data;
        })
    };
}