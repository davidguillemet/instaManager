import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View
} from 'react-native';
import styles from './styles';

export default class UnconnectedHomeScreen extends React.Component {

    static navigationOptions = {
      title: 'Welcome'
    };
    
    render() {
      return (
        <View style={styles.mainBackground}>
          <Text style={styles.welcome}>
            Welcome to Insta Manager
          </Text>
          <Button style={styles.buttonConnect}
                  title='Connect to Instagram'
                  onPress={() => this.props.navigation.navigate('Connection')}/>
        </View>
      );
    }
  }
  