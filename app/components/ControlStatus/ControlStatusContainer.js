import { connect } from 'react-redux';
import { compose } from 'redux';
import { withNavigation } from 'react-navigation';
import ControlStatusUi from './ControlStatusUi';

const mapStateToProps = (state, ownProps) => {
    const controls = state.get('controls');
    return {
        running: controls.get('running'),
        errors: controls.get('errors')
    }
}

const ControlStatus = compose(withNavigation, connect(mapStateToProps))(ControlStatusUi);

export default ControlStatus;