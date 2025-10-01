import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import authReducer from './reducers/auth';
import notesReducer from './reducers/notes';
import tasksReducer from "./reducers/tasks";
import financeReducer from './reducers/finance';
import thunk from 'redux-thunk';

const middlewares = [thunk];

const rootReducer = combineReducers({
    auth: authReducer,
    notes: notesReducer,
    tasks: tasksReducer,
    finance: financeReducer,
});

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
