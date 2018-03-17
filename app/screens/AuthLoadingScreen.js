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

      var lastUserInfo = await global.instaFacade.getLastUserInfo();

      var initialStack = 'AuthStack';

      if (lastUserInfo) {
      
        var userServiceDelegate = new UserService('self');
        global.serviceManager.invoke(userServiceDelegate, lastUserInfo.accessToken)
        .then((userInfo) => {
          // FIXME: why forcing the context as this for _onGetUserInfo?
          //        while this._onGetUserInfo is properly called????
          this._onGetUserInfo.call(this, userInfo, lastUserInfo.accessToken);
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