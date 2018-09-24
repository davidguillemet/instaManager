import { launchControls } from './../actions/control';
import { MULTI_UPDATE } from './../actions';

export default controlStatusMiddleware = store => next => action => {
    let result = next(action)
    if (action.type === MULTI_UPDATE) {
        store.dispatch(launchControls());
    }
    return result
  }