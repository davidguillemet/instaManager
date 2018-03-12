/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { StackNavigator, SwitchNavigator } from 'react-navigation';

import stylesDef from './styles/common';

import ConnectionScreen from './screens/ConnectionScreen';
import UnconnectedHomeScreen from './screens/UnconnectedHomeScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import HomeScreen from './screens/HomeScreen';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends React.Component {
  render() {
    return <RootStack/>;
  }
}

const navigationOptions = {
  headerStyle: {
    backgroundColor: stylesDef.GLOBAL_BACKGROUND,
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
