import { connect } from 'react-redux';

import ProfileListScreenUI from './ProfileListScreenUI';

const mapStateToProps = (state, ownProps) => {
    return {
        Profiles: [
            { name: 'profile1' },
            { name: 'profile2'}
        ]
    }
}

const mapDispatchToProps = dispatch => {
    return {
    };
}

const ProfileListScreen = connect(mapStateToProps, mapDispatchToProps)(ProfileListScreenUI);

export default ProfileListScreen;