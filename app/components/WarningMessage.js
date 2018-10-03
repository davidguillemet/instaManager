import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import CommonStyles from './../styles/common';

export default WarningMessage = (props) => {

    const containerStyles = [CommonStyles.styles.standardTile, styles.errorContainer];
    if (props.centered) {
        containerStyles.push(styles.centeredContainer);
    }
    return (
        <View style={containerStyles}>
            <Text style={styles.errorText}>{props.message}</Text>
        </View>
    );

};

const styles = StyleSheet.create(
{
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
