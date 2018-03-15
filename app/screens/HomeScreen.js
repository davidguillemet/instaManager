import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class HomeScreen extends React.Component {

    render() {
        return (
            <View>
                <Text>{global.instaFacade.getUserName()}</Text>
            </View>
        );
      }
}