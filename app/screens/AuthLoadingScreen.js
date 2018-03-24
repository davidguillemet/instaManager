import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Alert
} from 'react-native';

import UserService from '../services/users/UserService';

export default class AuthLoadingScreen extends React.Component {
    constructor() {
      super();
      this._tryToOpenLastSession();
    }
  
    // Fetch the token from storage then navigate to our appropriate place
    _tryToOpenLastSession = async () => {

      const lastAccessToken = await global.instaFacade.getLastUserInfo();

      const initialStack = 'AuthStack';

      if (lastAccessToken) {
      
        const userServiceDelegate = new UserService('self');
        global.serviceManager.invoke(userServiceDelegate, lastAccessToken)
        .then((userInfo) => {
          // FIXME: why forcing the context as this for _onGetUserInfo?
          //        while this._onGetUserInfo is properly called????
          this._onGetUserInfo.call(this, userInfo, lastAccessToken);
        });

      } else {

        this.props.navigation.navigate('AuthStack');
      }
    };

    _onGetUserInfo(userInfo, accessToken) {

      global.instaFacade.openSession(accessToken);
      global.userManager.setCurrentUser(userInfo, accessToken);      
      this.props.navigation.navigate('AppStack');
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