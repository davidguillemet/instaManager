import React from 'react';

import {
    View
} from 'react-native';

import { NotificationType, BottomNotification } from '../BottomNotification';

export default class ControlBottomNotificationUi extends React.PureComponent {

    constructor(props){
        super(props);

        this.state = {
            didUpdate: false
        }
    }

    componentDidUpdate() {

        if (this.props.hasErrors == true && this.state.didUpdate == false) {
            this.setState({didUpdate: true});
        }
    }

    render() {

        return (
            this.state.didUpdate == true && this.props.hasErrors == false ?
            <BottomNotification
                caption={'All issues have been fixed.'}
                type={NotificationType.SUCCESS}
                manuallyCloseable={true}
            />
            :
            null
        );
    }
}
