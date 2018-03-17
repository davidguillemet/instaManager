import React, { Component } from 'react';
import {
  StyleSheet,
  WebView,
  ActivityIndicator
} from 'react-native';

import CookieManager from 'react-native-cookies';
import CommonStyles from '../styles/common';
import UserService from '../services/users/UserService';

export default class ConnectionScreen extends React.Component {

  static navigationOptions = {
    title: 'Connection'
  };

  constructor(props) {
    super(props);
  }
    
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
      var parametersStart = global.instaFacade.config.redirectUri.length + 1; // + 1 for '?' (explicit) or '#' (implicit)
      var parameters = webViewState.url.substr(parametersStart);
      
      if (parameters.startsWith('code=')) {
        
        // Server-sode authentication (Explicit) -> not for mobile app
        var code = parameters.substr('code='.length);
        this._requireAccessToken(code);

      } else if (parameters.startsWith('access_token=')) {

        // Client-side authentication (Implicit) -> for mobile app
        var accessToken = parameters.substr('access_token='.length);
        this._getUserInformations(accessToken);
        
      } else {
        // cancel authorization = go back to unconnected home
        this.props.navigation.goBack();
      } 
      
      return false;
    }

    return true;
  }

  _getUserInformations(accessToken) {

    var userServiceDelegate = new UserService('self');//, (response) => this._onGetUserInfo(response, accessToken));
    global.serviceManager.invoke(userServiceDelegate, accessToken)
    .then((userInfo) => {
      // FIXME: why forcing the context as this for _onGetUserInfo?
      //        while this._onGetUserInfo is properly called????
      this._onGetUserInfo.call(this, userInfo, accessToken);
    });
  }

  _onGetUserInfo(userInfo, accessToken) {
    global.instaFacade.openSession(accessToken);
    global.instaFacade.setLastUserInfo(userInfo.id, accessToken);
    global.userManager.setCurrentUser(userInfo, accessToken);
    this.props.navigation.navigate('AppStack');
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