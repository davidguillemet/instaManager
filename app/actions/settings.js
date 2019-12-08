export const SET_DISPLAY_ERRORS = 'SET_DISPLAY_ERRORS';

export function createSetDisplayErrorsAction(value) {
    return {
        type: SET_DISPLAY_ERRORS,
        value: value
    }
}
