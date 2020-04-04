import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import UserService from '../services/users/UserService';

export default class AuthLoadingScreen extends React.Component {
    constructor() {
      super();
      this._tryToOpenLastSession();
    }
  
    // Fetch the token from storage then navigate to our appropriate place
    _tryToOpenLastSession = async () => {

      await global.instaFacade.restoreLastUserInfo();

      const initialStack = 'AuthStack';

      if (global.instaFacade.isSessionOpen()) {

        const userServiceDelegate = new UserService(global.instaFacade.getUserId());
        global.serviceManager.invoke(userServiceDelegate)
        .then((userInfo) => {
          this._onGetUserInfo.call(this, userInfo);
        }).catch((error) => {
          this.props.navigation.push('AuthStack');
        });

      } else {

        this.props.navigation.push('AuthStack');
      }
    };

    _onGetUserInfo(userInfo) {

      global.userManager.setCurrentUser(userInfo);      
      this.props.navigation.push('AppStack');
    }


    // Render any loading content that you like here
    render() {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });