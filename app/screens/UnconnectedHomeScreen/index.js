import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';
import { LoginButton, LoginManager} from 'react-native-fbsdk';
import CustomButton from '../../components/CustomButton';
import CommonStyles from '../../styles/common';
import styles from './styles';

export default class UnconnectedHomeScreen extends React.Component {

    static navigationOptions = {
      title: 'Welcome'
    };
    
    _onLoginFinished(error, result) {
        
        if (error) {
          Alert.alert("Login failed with error: " + result.error);
        } else if (result.isCancelled) {
          Alert.alert("Login was cancelled");
        } else {
          Alert.alert("Login was successful with permissions: " + result.grantedPermissions)
        }
    }

    _onLogoutFinished() {
        Alert.alert("User logged out");
    }

    _onInstagramConnect() {
      this.props.navigation.push('Connection');
    }

    _onFacebookConnect() {

      const loginPermisions = [
        "public_profile",
        // "instagram_basic",
        // "instagram_manage_comments",
        // "instagram_manage_insights",
        // "manage_pages"
      ];

      // LoginManager.logInWithReadPermissions(['public_profile', 'instagram_basic']).then(
      LoginManager.logInWithReadPermissions(loginPermisions).then(
          function(result) {
          if (result.isCancelled) {
            alert('Login was cancelled');
          } else {
            alert('Login was successful with permissions: '
              + result.grantedPermissions.toString());
          }
        },
        function(error) {
          alert('Login failed with error: ' + error);
        }
      );
    }

    render() {
      
      return (
        <View style={styles.mainBackground}>
          <Text style={styles.welcome}>
            Welcome to Insta Manager
          </Text>
          <CustomButton style={CommonStyles.styles.standardButton}
                  title='Connect to Instagram'
                  onPress={this._onInstagramConnect.bind(this)}/>
          <CustomButton style={CommonStyles.styles.standardButton}
                  title='Connect with Facebook'
                  onPress={this._onFacebookConnect.bind(this)}/>
          <LoginButton
              publishPermissions={["publish_actions", "instagram_basic"]}
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    alert("Login failed with error: " + result.error);
                  } else if (result.isCancelled) {
                    alert("Login was cancelled");
                  } else {
                    alert("Login was successful with permissions: " + result.grantedPermissions)
                  }
                }
              }
              onLogoutFinished={() => alert("User logged out")}/>
          </View>
      );
    }
  }
  