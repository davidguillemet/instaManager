import React, { Component } from 'react';
import {
  StyleSheet,
  WebView,
  ActivityIndicator
} from 'react-native';

import CommonStyles from '../styles/common';

import CookieManager from 'react-native-cookies';

export default class ConnectionScreen extends React.Component {
  
  static navigationOptions = {
    title: 'Connection'
  };  
  
  componentDidMount() {
    CookieManager.clearAll();
  }
  
  ActivityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color='#009688'
        size='large'
        style={styles.ActivityIndicatorStyle}
      />
    );
  }

  render() {
    return (
      <WebView
        source={{uri: global.instaFacade.getAuthorizationUrl()}}
        startInLoadingState={true}
        renderLoading={this.ActivityIndicatorLoadingView}
        onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest.bind(this)}
      />
    );
  }

  _onShouldStartLoadWithRequest(webViewState) {
    if (webViewState.url.startsWith(global.instaFacade.config.redirectUri)) {
      // redirect Uri lookslike http://<redirect path>?<parameters>
      // Parameters might be
      // - code=<code>
      // - error=<error>&error_reason=<reason>&error_description=<decription>
      // -> extract code and return false
      var parametersStart = global.instaFacade.config.redirectUri.length + 1; // + 1 for '?'
      var parameters = webViewState.url.substr(parametersStart);
      
      if (parameters.startsWith('code=')) {
        
        var code = parameters.substr('code='.length);
        this._requireAccessToken(code);

      } else {
        // cancel authorization = go back to unconnected home
        this.props.navigation.goBack();
      } 
      
      return false;
    }

    return true;
  }

  _requireAccessToken(code) {
    var authBody = "client_id=" + global.instaFacade.config.clientId +
          "&client_secret=" + global.instaFacade.config.clientSecret +
          "&grant_type=authorization_code" +
          "&redirect_uri=" + global.instaFacade.config.redirectUri +
          "&code=" + code;

    return fetch(
      global.instaFacade.config.accessTokenUri,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: authBody
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((jsonToken) => {
      global.connectionManager.updateAuthorizedUsersInfo(jsonToken);
      global.instaFacade.openSession(jsonToken);
      this.props.navigation.navigate('AppStack');
    });
  }
}

const styles = StyleSheet.create(
{
  ActivityIndicatorStyle:{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    
  }
});