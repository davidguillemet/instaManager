import { connect } from 'react-redux';
import { createProfileDeleteAction } from '../../actions';
import { loadActiveProfileContent } from '../../actions'

import ProfileListScreenUI from './ProfileListScreenUI';

const mapStateToProps = (state, ownProps) => {
    return {
        profiles: state.get('profiles').toArray().sort((p1, p2) => p1.name.localeCompare(p2.name)),
        activeProfileId: global.settingsManager.getActiveProfile()
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onDeleteProfile: (profileId) => {
            const activeProfileId = global.settingsManager.getActiveProfile();
            if (activeProfileId == profileId) {
                global.settingsManager.setActiveProfile(global.MAIN_PROFILE_ID);
                loadActiveProfileContent(dispatch);
            }
            global.hashtagPersistenceManager.deleteProfile(profileId);
            dispatch(createProfileDeleteAction(profileId));
        },
        onSetActiveProfile: (profileId) => {
            global.settingsManager.setActiveProfile(profileId);
            loadActiveProfileContent(dispatch);
        }
    };
}

const ProfileListScreen = connect(mapStateToProps, mapDispatchToProps)(ProfileListScreenUI);

export default ProfileListScreen;