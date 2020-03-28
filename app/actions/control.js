export const CONTROLS_STARTED = 'CONTROLS_STARTED';
export const CONTROLS_COMPLETED = 'CONTROLS_COMPLETED';

export function launchControls() {
    return (dispatch, getState) => {
        if (getState().get('categoriesLoaded') === true &&
            getState().get('tagsLoaded') === true &&
            getState().get('controls').get('running') === false) {
          return dispatch(createRunControlsAction())
        }
    }
}

export function runControls(dispatch, postAction) {
    return global.hashtagUtil.runControls()
    .then((errors) => {
        dispatch(createControlsCompletedAction(errors));
        if (postAction) {
            dispatch(postAction);
        }
    })
}

function createRunControlsAction() {
    return dispatch => {        
        dispatch(createControlsStartedAction());
        return runControls(dispatch);
    }
}

function createControlsStartedAction() {
    return {
        type: CONTROLS_STARTED
    }
}

export function createControlsCompletedAction(errors) {
    return {
        type: CONTROLS_COMPLETED,
        errors: errors
    }
}
