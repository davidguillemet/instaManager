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

function createRunControlsAction() {
    return dispatch => {
        
        dispatch(createControlsStartedAction());
        
        return global.hashtagUtil.runControls()
        .then((errors) => {
            dispatch(createControlsCompletedAction(errors));
        })
    }
}

function createControlsStartedAction() {
    return {
        type: CONTROLS_STARTED
    }
}

function createControlsCompletedAction(errors) {
    return {
        type: CONTROLS_COMPLETED,
        errors: errors
    }
}
