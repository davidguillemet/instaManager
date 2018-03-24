/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import { Alert } from 'react-native';
import { StackNavigator, SwitchNavigator } from 'react-navigation';

import LoadingIndicatorView from './components/LoadingIndicator';

import { UserSchema, HistorySchema } from './model/realmSchemas';

import RootStack from './navigation/Navigation';

const Realm = require('realm');

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isLoading: true};
  }

  componentWillMount() {
    // When loading the application, only loads user basic information
    Realm.open({
      schema: [ UserSchema, HistorySchema ],
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

