import React, { Component } from 'react';
import {
  StyleSheet,
  WebView,
  Alert
} from 'react-native';

import InstaFacade from '../managers/InstaFacade.js';

export default class ConnectionPage extends React.Component {
  
  static navigationOptions = {
    title: 'Connection'
  };  
  
  render() {
    return (
      <WebView
        source={{uri: InstaFacade.getAuthorizationUrl()}}
        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
      />
    );
  }

  _onNavigationStateChange(webViewState){
    Alert.alert(webViewState.url);
  }
}