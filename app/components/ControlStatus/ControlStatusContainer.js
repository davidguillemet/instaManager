import { connect } from 'react-redux';
import { compose } from 'redux';
import { withNavigation } from 'react-navigation';
import ControlStatusUi from './ControlStatusUi';

const mapStateToProps = (state, ownProps) => {
    const controls = state.get('controls');
    return {
        running: controls.get('running'),
        errors: controls.get('errors'),
        displayErrors: state.get('settings').get('displayErrors')
    }
}

const ControlStatus = compose(withNavigation, connect(mapStateToProps))(ControlStatusUi);

export default ControlStatus;