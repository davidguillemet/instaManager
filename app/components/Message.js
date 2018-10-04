import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import CommonStyles from '../styles/common';

export default Message = (props) => {

    const containerStyles = [CommonStyles.styles.standardTile, props.error ? styles.errorContainer : styles.successContainer];
    if (props.centered) {
        containerStyles.push(styles.centeredContainer);
    }

    const textStyle = props.error ? styles.errorText : styles.successText;

    return (
        <View style={containerStyles}>
            <Text style={textStyle}>{props.message}</Text>
        </View>
    );

};

const styles = StyleSheet.create(
{
    successText: {
        color: CommonStyles.DARK_GREEN
    },
    successContainer: {
        backgroundColor: CommonStyles.LIGHT_GREEN
    },
    errorText: {
        color: CommonStyles.DARK_RED
    },
    errorContainer: {
        backgroundColor: CommonStyles.LIGHT_RED
    },
    centeredContainer: {
        justifyContent: 'center'
    }
});
