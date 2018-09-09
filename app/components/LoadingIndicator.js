import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default class ActivityIndicatorLoadingView extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.ActivityIndicatorContainer}>
                <View style={styles.ActivityIndicatorStyle} />
                <ActivityIndicator size='large' />
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    ActivityIndicatorContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ActivityIndicatorStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0,
        backgroundColor: 'black',
    }
});