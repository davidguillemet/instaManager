import { Map, List } from 'immutable';

export const TAGS_LOADED = 'TAGS_LOADED';
export const ADD_TAG = 'ADD_TAG';
export const UPDATE_TAG = 'UPDATE_TAG';
export const DELETE_TAG = 'DELETE_TAG';

export function loadTagsIfNeeded() {
    return (dispatch, getState) => {
        if (getState().get('tagsLoaded') === false) {
          return dispatch(createLoadTagsAction())
        }
      }
}

export function createLoadTagsAction() {
    return dispatch => {
        return global.hashtagPersistenceManager.open()
        .then(() => {
            const hashtags = global.hashtagPersistenceManager.getHashtags();
            const immutableTagsMap = Map(hashtags.map(item => [item.id, item]));
            dispatch(createTagsLoadedAction(immutableTagsMap));
        })
    }
}

export function createTagsLoadedAction(tagsMap) {
    return {
        type: TAGS_LOADED,
        tags: tagsMap
    }
}

export function createAddTagAction(tag) {
    return {
        type: ADD_TAG,
        tag: tag
    };
}

export function createUpdateTagAction(tag) {
    return {
        type: UPDATE_TAG,
        tag: tag
    };
}

export function createDeleteTagAction(tagId) {
    return {
        type: DELETE_TAG,
        tagId: tagId
    };
}
