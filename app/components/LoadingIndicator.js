import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

export default class ActivityIndicatorLoadingView extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return <ActivityIndicator
                color='#009688'
                size='large'
                style={styles.ActivityIndicatorStyle}
        />;
    }
}

const styles = StyleSheet.create(
{
    ActivityIndicatorStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});