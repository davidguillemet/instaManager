import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
    constructor() {
      super();
      this.tryToOpenLastSession();
    }
  
    // Fetch the token from storage then navigate to our appropriate place
    tryToOpenLastSession = async () => {

      var lastUserInfo = await global.connectionManager.getLastUserInfo();

      var initialStack = 'AuthStack';

      if (lastUserInfo != null) {

        global.instaFacade.openSession(lastUserInfo);
        // Session is opened, we can go directly to the application stack
        initialStack = 'AppStack'
      }

      this.props.navigation.navigate(initialStack);
    };

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