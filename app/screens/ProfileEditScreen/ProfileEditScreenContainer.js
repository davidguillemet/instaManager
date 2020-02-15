import { connect } from 'react-redux';
import { createProfileUpdateAction } from '../../actions';

import ProfileEditScreenUI from './ProfileEditScreenUI';

const mapStateToProps = (state, ownProps) => {

    const profileId = ownProps.navigation.getParam('profileId', null);
    const profile = profileId != null ? global.hashtagUtil.getProfileFromId(profileId) : null;

    return {
        profileId: profileId || global.uniqueID(),
        profileName: profile ? profile.name : '',
        profileDesc: profile ? profile.desscription : '',
        editorMode: profileId ? global.UPDATE_MODE : global.CREATE_MODE
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSaveProfile: (profileToSave, isAnUpdate) => {
            const savedProfile = global.hashtagPersistenceManager.saveProfile(profileToSave, isAnUpdate);
            dispatch(createProfileUpdateAction(savedProfile));
        }
    };
}

const ProfileEditScreen = connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreenUI);

export default ProfileEditScreen;