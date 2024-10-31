import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import { productReducer, vipReducer } from './reducers/productReducer';

const rootReducer = combineReducers({
  product: productReducer,
  vip: vipReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
