import React from 'React';
import {
    TouchableOpacity,
    View
} from 'react-native';

import CommonStyles from '../styles/common';
import ControlDetails from '../components/ControlDetails';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ControlDetailsScreen extends React.PureComponent {

    constructor(props) {
        super(props);

        this.onClose = this.onClose.bind(this);
    }

    onClose() {

        this.props.navigation.goBack(null);
    }

    render() {
        return (
            <View style={CommonStyles.styles.standardPage}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                    <TouchableOpacity onPress={this.onClose}>
                        <Ionicons style={{color: CommonStyles.GLOBAL_FOREGROUND}} name={'ios-close'} size={50}/>
                    </TouchableOpacity>
                </View>
                <ControlDetails />
            </View>
        );
    }

} 