/**
 * REdux store creation and configuration including thunk middleware for asynchron actions
 */

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { rootReducer } from './reducers';
import controlStatusMiddleware from './middleware/controlstatus';

const loggerMiddleware = createLogger();

export default function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware,
            controlStatusMiddleware
        )
    )
};
