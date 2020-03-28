import { connect } from 'react-redux';
import ControlBottomNotificationUi from './ControlBottomNotificationUi';

const mapStateToProps = (state, ownProps) => {
    const errors = state.get('controls').get('errors');
    return {
        hasErrors: errors && (errors.duplicates.length > 0 || errors.overflow.length > 0),
        activeProfile: global.settingsManager.getActiveProfile(),
        activeProfileLoading: state.get("profileLoading")
    }
}

const ControlBottomNotification = connect(mapStateToProps)(ControlBottomNotificationUi);

export default ControlBottomNotification;