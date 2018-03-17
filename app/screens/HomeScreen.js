import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert
} from 'react-native';

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        const userInfo = global.userManager.getCurrentUser();
        return (
            <View>
                <Text>{userInfo.full_name}</Text>
            </View>
        );
      }
}