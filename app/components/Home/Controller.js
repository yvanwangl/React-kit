import {connect} from 'react-redux';
import Model from './Model';
import View from './Model';


class Controller {
    Model = Model;
    View = View;
    init(){
        return <View />;
    }

    staticFetch({params=1}){
        return 2;
    }

    render(){
        return <View staticFetch={this.staticFetch} />;
    }
}

connect()(Controller);