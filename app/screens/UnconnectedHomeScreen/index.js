import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import CommonStyles from '../../styles/common';
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
          <CustomButton style={CommonStyles.styles.standardButton}
                  title='Connect to Instagram'
                  onPress={() => this.props.navigation.navigate('Connection')}/>
        </View>
      );
    }
  }
  