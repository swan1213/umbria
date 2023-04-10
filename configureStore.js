import { createStore, combineReducers } from 'redux';
import chatReducer from './src/modules/reducer';

const rootReducer = combineReducers(
    { umbriaReducer: chatReducer }
);

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;