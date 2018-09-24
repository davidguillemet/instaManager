import { connect } from 'react-redux';
import ControlStatusUi from './ControlStatusUi';

const mapStateToProps = (state, ownProps) => {
    const controls = state.get('controls');
    return {
        running: controls.get('running'),
        errors: controls.get('errors')
    }
}

const ControlStatus = connect(mapStateToProps)(ControlStatusUi);

export default ControlStatus;