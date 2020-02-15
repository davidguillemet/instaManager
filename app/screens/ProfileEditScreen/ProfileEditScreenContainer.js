import { connect } from 'react-redux';
import { createProfileUpdateAction } from '../../actions';
import { loadActiveProfileContent } from '../../actions'

import ProfileEditScreenUI from './ProfileEditScreenUI';

const mapStateToProps = (state, ownProps) => {

    const profileId = ownProps.navigation.getParam('profileId', null);
    const profile = profileId != null ? global.hashtagUtil.getProfileFromId(profileId) : null;

    return {
        profileId: profileId || global.uniqueID(),
        profileName: profile ? profile.name : '',
        profileDesc: profile ? profile.description : '',
        editorMode: profile ? global.UPDATE_MODE : global.CREATE_MODE,
        activeProfileId: global.settingsManager.getActiveProfile()
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSaveProfile: (profileToSave, isAnUpdate, setAsActiveProfile) => {
            const savedProfile = global.hashtagPersistenceManager.saveProfile(profileToSave, isAnUpdate);
            dispatch(createProfileUpdateAction(savedProfile));
            if (setAsActiveProfile) {
                global.settingsManager.setActiveProfile(profileToSave.id);
                loadActiveProfileContent(dispatch);
            }
        }
    };
}

const ProfileEditScreen = connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreenUI);

export default ProfileEditScreen;