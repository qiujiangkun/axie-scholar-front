import { combineReducers } from 'redux';
import Auth from './Auth';
import Theme from './Theme';
import authentication from './Authentication';
import alert from './Alert';
import { scholars } from './Scholar';

const reducers = combineReducers({
    theme: Theme,
    auth: Auth,
    authentication,
    alert,
    scholars
});

export default reducers;