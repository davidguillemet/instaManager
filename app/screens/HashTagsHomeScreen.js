import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class HashTagsHomeScreen extends React.Component {

    render() {
        return(
            <View style={CommonStyles.styles.standardPage}>
                <View style={CommonStyles.styles.standardTile}>
                    <Text style={CommonStyles.styles.mediumLabel}>Hash Tags Management</Text>
                </View>
            </View>
        );
    }
}