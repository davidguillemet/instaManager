import { Map } from 'immutable';

import { loadCategories } from './categories';
import { loadHashtags } from './tags';
import { launchControls } from './control';
import { forceLoadPublications } from './publications';

export const PROFILES_LOADED = 'PROFILES_LOADED';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const DELETE_PROFILE = 'DELETE_PROFILE';

export function loadProfiles() {
    return (dispatch, getState) => {
        return dispatch(createLoadProfilesAction())
    }
}

function createLoadProfilesAction() {
    return dispatch => {
        return global.hashtagPersistenceManager.getProfiles()
        .then((profiles) => {
            const immutableMap = Map(profiles.map(item => [item.id, item]));
            loadActiveProfileContent(dispatch, true);
            dispatch(createProfilesLoadedAction(immutableMap));
        })
    }
}

export function loadActiveProfileContent(dispatch, initialLoad) {
    dispatch(loadCategories());
    dispatch(loadHashtags());
    dispatch(launchControls());
    if (initialLoad == undefined) {
        dispatch(forceLoadPublications());
    }
}

export function createProfilesLoadedAction(map) {
    return {
        type: PROFILES_LOADED,
        profiles: map
    }
}

export function createProfileUpdateAction(profile) {
    return {
        type: UPDATE_PROFILE,
        profile: profile
    }
}

export function createProfileDeleteAction(profileId) {
    return {
        type: DELETE_PROFILE,
        profileId: profileId
    }
}
