import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class SettingsScreen extends React.Component {

    render() {
        return(
            <View style={CommonStyles.styles.standardPage}>
                <View style={CommonStyles.styles.standardTile}>
                    <Text style={CommonStyles.styles.mediumLabel}>Settings</Text>
                </View>
            </View>
        );
    }
}