import { Map } from 'immutable';

export const TAGS_LOADED = 'TAGS_LOADED';
export const ADD_TAG = 'ADD_TAG';
export const UPDATE_TAG = 'UPDATE_TAG';
export const DELETE_TAG = 'DELETE_TAG';
export const SET_TAG_FILTER = 'SET_TAGS_FILTER';

export const TagFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_ORPHANS: 'SHOW_ORPHANS'
  }

export function loadHashtags() {
    const hashtags = global.hashtagPersistenceManager.getHashtags();
    const immutableTagsMap = Map(hashtags.map(item => [item.id, item]));
    return createTagsLoadedAction(immutableTagsMap);
}

function createTagsLoadedAction(tagsMap) {
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

export function createSetTagFilterAction(filter) {
    return {
        type: SET_TAG_FILTER,
        filter: filter
    };
}

export function createUpdateMediaCountAction(updatedTag) {
    return {
        type: UPDATE_TAG,
        tag: updatedTag
    };
}
