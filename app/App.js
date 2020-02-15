/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';
import {
  StatusBar,
  View
} from 'react-native';

import RootStack from './navigation/Navigation';

import { Provider } from 'react-redux';
import configureStore from './store';
import HashtagUtil from './managers/HashtagUtil';
import { loadProfiles } from './actions'

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      initialized: false
    }
  }

  componentDidMount() {
    global.settingsManager.initialize().then(() => {
      this.setState({initialized: true});
    });
  }

  render() {
    if (this.state.initialized) {
      const store = configureStore();
      global.hashtagUtil = new HashtagUtil(store);
      store.dispatch(loadProfiles());
      return (
        <View style={{flex: 1}}>
          <StatusBar barStyle="light-content" />
          <Provider store={store}>
            <RootStack />
          </Provider>
        </View>
      )
    } else {
      return null;
    }
  }
}

