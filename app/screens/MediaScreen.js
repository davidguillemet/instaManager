import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import CommonStyles from '../styles/common';

export default class MediaScreen extends React.Component {

    _onDisconnect() {
        global.instaFacade.closeCurrentSession();
        this.props.navigation.navigate('AuthLoading');
    }

    render() {
        return(
            <View style={CommonStyles.styles.standardPage}>
                <View style={CommonStyles.styles.standardTile}>
                    <Text style={CommonStyles.styles.mediumLabel}>Media stats</Text>
                </View>
            </View>
        );
    }
}