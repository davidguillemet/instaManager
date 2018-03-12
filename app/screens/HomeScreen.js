import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import InstaFacade from '../managers/InstaFacade.js';

export default class HomeScreen extends React.Component {

    render() {
        return (
            <View>
                <Text>{InstaFacade.getUserName()}</Text>
            </View>
        );
      }
}