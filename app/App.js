/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import { Alert } from 'react-native';
import { StackNavigator, SwitchNavigator } from 'react-navigation';

import stylesDef from './styles/common';

import ConnectionScreen from './screens/ConnectionScreen';
import UnconnectedHomeScreen from './screens/UnconnectedHomeScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import HomeScreen from './screens/HomeScreen';

import LoadingIndicatorView from './components/LoadingIndicator';

import { UserSchema } from './model/realmSchemas';

const Realm = require('realm');

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isLoading: true};
  }

  componentWillMount() {
    // When loading the application, only loads user basic information
    Realm.open({
      schema: [ UserSchema ],
      path: 'basicUserInfo.realm'
    }).then(realm => {
      global.userManager.setRealm(realm);
      this.setState({
        isLoading: false
      });
    }).catch(error => {
      this.setState({
        isLodaing: false
      });
      Alert.alert("Error", error.message);
    });
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicatorView/>;
    } else {
      return <RootStack/>;
    }
  }
}

const navigationOptions = {
  headerStyle: {
    backgroundColor: stylesDef.GLOBAL_FOREGROUND,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  }
}

const AppStack = StackNavigator(
  {
    Home: { screen: HomeScreen }
  },
  {
    initialRouteName: 'Home',
    navigationOptions: navigationOptions
  },
);

const AuthStack = StackNavigator(
  {
    Unconnected: { screen: UnconnectedHomeScreen },
    Connection: { screen: ConnectionScreen },
  },
  {
    initialRouteName: 'Unconnected',
    navigationOptions: navigationOptions
  },
);

const RootStack = SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    AppStack: AppStack,
    AuthStack: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
