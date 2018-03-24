import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';

import CommonStyles from '../styles/common';

import CustomButton from '../components/CustomButton';

export default class SettingsScreen extends React.Component {

    _onDisconnect() {
        global.instaFacade.closeCurrentSession();
        this.props.navigation.navigate('AuthLoading');
    }

    _onclearData() {

    }

    render() {
        return(
            <View style={CommonStyles.styles.standardPage}>
                <View style={CommonStyles.styles.standardTile}>
                    <Text style={CommonStyles.styles.mediumLabel}>Settings</Text>
                </View>
                <View style={{ alignItems: 'center'}}>
                    <CustomButton
                        style={CommonStyles.styles.standardButton}
                        onPress={this._onDisconnect.bind(this)}
                        title="Disconnect"
                        color={CommonStyles.TEXT_COLOR}/>
                    <CustomButton
                        style={CommonStyles.styles.standardButton}
                        onPress={this._onclearData.bind(this)}
                        title="Clear data"
                        color={CommonStyles.TEXT_COLOR}/>
                </View>
            </View>
        );
    }
}