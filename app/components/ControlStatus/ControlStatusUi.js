import React from 'react';

import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ControlStatusUi extends React.PureComponent {

    constructor(props){
        super(props);

        this.openControlDetails = this.openControlDetails.bind(this);
    }

    openControlDetails() {

        this.props.navigation.navigate('ControlDetailsModal');
    }

    render() {

        if (this.props.running === true) {
            return (
                <View style={styles.statusContainer}>
                    <ActivityIndicator />
                </View>
            );
        }
        else {

            const hasErrors = this.props.errors && (this.props.errors.duplicates.length > 0 || this.props.errors.overflow.length > 0);
            const color = hasErrors ? CommonStyles.LIGHT_RED : CommonStyles.LIGHT_GREEN;
            const iconName = hasErrors ? 'ios-alert' : 'ios-checkmark-circle';

            if (hasErrors == false) {
                return null;
            }

            return (
                <View style={styles.statusContainer}>
                    <TouchableOpacity onPress={this.openControlDetails}>
                        <Ionicons style={{color: color}} name={iconName} size={40} />
                    </TouchableOpacity>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create(
{
    statusContainer: {
        position: 'absolute',
        bottom: 0,
        right: CommonStyles.INDEX_LIST_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CommonStyles.COLOR_TRANSPARENT
    }
});