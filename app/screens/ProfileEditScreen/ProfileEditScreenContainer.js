import { connect } from 'react-redux';
import { compose } from 'redux';
import { createProfileUpdateAction } from '../../actions';
import { loadActiveProfileContent } from '../../actions'

import ProfileEditScreenUI from './ProfileEditScreenUI';
import withSaveButton from './../../components/WithSaveButton';

const mapStateToProps = (state, ownProps) => {

    const profileId = ownProps.navigation.getParam('profileId', null);
    const profile = profileId != null ? global.hashtagUtil.getProfileFromId(profileId) : null;

    return {
        profileId: profileId,
        profileName: profile ? profile.name : '',
        profileDesc: profile && profile.description ? profile.description : '',
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

const ProfileEditScreen = compose(connect(mapStateToProps, mapDispatchToProps), withSaveButton)(ProfileEditScreenUI);

export default ProfileEditScreen;