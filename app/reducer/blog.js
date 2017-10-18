import {SUCCESS} from '../contants/blog';

export default function blog(state={blogs:[]}, action){
    let actionType = action.type;
    switch(actionType) {
        case SUCCESS:
            return Object.assign({}, state, {blogs: action.payload});
        default:
            return state;
    }
}