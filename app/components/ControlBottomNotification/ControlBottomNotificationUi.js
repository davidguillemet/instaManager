import React from 'react';

import { NotificationType, BottomNotification } from '../BottomNotification';

export default class ControlBottomNotificationUi extends React.PureComponent {

    constructor(props){
        super(props);

        this.hasErrors = this.props.hasErrors;
        this.activeProfile = this.props.activeProfile;
    }

    render() {

        if (this.props.activeProfileLoading == true) {
            return null;
        }

        const hadErrors = this.hasErrors;
        this.hasErrors = this.props.hasErrors;

        const previousProfile = this.activeProfile;
        this.activeProfile = this.props.activeProfile;

        return (
            this.hasErrors == false && hadErrors == true && this.activeProfile == previousProfile ?
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
