import {SUCCESS} from '../contants/blog';

export function add(value){
    return {
        type: SUCCESS,
        payload: value
    }
}