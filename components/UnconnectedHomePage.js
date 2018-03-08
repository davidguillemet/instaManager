import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View
} from 'react-native';

export default class UnconnectedHomePage extends React.Component {

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

  const styles = StyleSheet.create({
    mainBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#406eb7',
    },
    welcome: {
      fontSize: 24,
      fontFamily: 'Arial',
      textAlign: 'center',
      color: 'white',
      margin: 10,
    },
    buttonConnect: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });
  