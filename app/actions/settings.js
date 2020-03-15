export const SET_DISPLAY_ERRORS = 'SET_DISPLAY_ERRORS';
export const SET_PUBLICATION_HEADER = 'SET_PUBLICATION_HEADER';
export const SET_PUBLICATION_FOOTER = 'SET_PUBLICATION_FOOTER';
export const SET_NEW_LINE_SEPARATOR = 'SET_NEW_LINE_SEPARATOR';
export const SET_MAX_TAG_NUMBER = 'SET_MAX_TAG_NUMBER';

function createSetParameterFunction(type, value) {
    return {
        type: type,
        value: value
    }
}

export function createSetMaxTagNumberAction(value) {
    return createSetParameterFunction(SET_MAX_TAG_NUMBER, value);
}
export function createSetPublicationHeaderAction(value) {
    return createSetParameterFunction(SET_PUBLICATION_HEADER, value);
}
export function createSetPublicationFooterAction(value) {
    return createSetParameterFunction(SET_PUBLICATION_FOOTER, value);
}
export function createSetDisplayErrorsAction(value) {
    return createSetParameterFunction(SET_DISPLAY_ERRORS, value);
}
export function createSetNewLineSeparatorAction(value) {
    return createSetParameterFunction(SET_NEW_LINE_SEPARATOR, value);
}
