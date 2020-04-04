import React from 'React';

import ControlDetails from '../components/ControlDetails';
import ModalTemplate from '../components/ModalTemplate';

export default class ControlDetailsScreen extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ModalTemplate>
                <ControlDetails />
            </ModalTemplate>
        );
    }

} 