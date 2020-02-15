import { Map } from 'immutable';

export const PUBLICATIONS_LOADED = 'PUBLICATIONS_LOADED';
export const PUBLICATIONS_LOADING = 'PUBLICATIONS_LOADING';
export const ADD_PUBLICATION = 'ADD_PUBLICATION';
export const DELETE_PUBLICATION = 'DELETE_PUBLICATION';
export const SET_PUBLICATION_FILTER = 'SET_PUBLICATION_FILTER';

export function loadPublicationsIfNeeded() {
    return (dispatch, getState) => {
        if (getState().get('publicationsLoaded') === false) {
            dispatch(createLoadPublicationsAction())
        }
    }
}

export function forceLoadPublications() {
    return (dispatch, getState) => {
        dispatch(createPublicationsLoadingAction());
        dispatch(createLoadPublicationsAction())
    }
}

function createLoadPublicationsAction() {
    const publications = global.hashtagPersistenceManager.getPublications();
    const immutableMap = Map(publications.map(item => [item.id, item]));
    return createPublicationsLoadedAction(immutableMap);
}

export function createPublicationsLoadingAction() {
    return {
        type: PUBLICATIONS_LOADING,
    }
}

export function createPublicationsLoadedAction(map) {
    return {
        type: PUBLICATIONS_LOADED,
        publications: map
    }
}

export function createAddPublicationAction(publication) {
    return {
        type: ADD_PUBLICATION,
        publication: publication
    }
}

export function createDeletePublicationAction(pubId) {
    return {
        type: DELETE_PUBLICATION,
        publication: pubId
    }
}

export function createSetPublicationFilterAction(filter) {
    return {
        type: SET_PUBLICATION_FILTER,
        filter: filter
    }
}
