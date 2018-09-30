import { Map } from 'immutable';

export const PUBLICATIONS_LOADED = 'PUBLICATIONS_LOADED';
export const ADD_PUBLICATION = 'ADD_PUBLICATION';
export const DELETE_PUBLICATION = 'DELETE_PUBLICATION';

export function loadPublicationsIfNeeded() {
    return (dispatch, getState) => {
        if (getState().get('publicationsLoaded') === false) {
          return dispatch(createLoadPublicationsAction())
        }
      }
}

function createLoadPublicationsAction() {
    return dispatch => {
        return global.hashtagPersistenceManager.getPublications()
        .then((publications) => {
            const immutableMap = Map(publications.map(item => [item.id, item]));
            dispatch(createPublicationsLoadedAction(immutableMap));
        })
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
