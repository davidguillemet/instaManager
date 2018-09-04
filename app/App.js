/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';

import RootStack from './navigation/Navigation';

import { Provider } from 'react-redux';
import configureStore from './store';
import HashtagUtil from './managers/HashtagUtil';

export default class App extends React.Component {

  render() {
    const store = configureStore();
    global.hashtagUtil = new HashtagUtil(store);
    return (
      <Provider store={store}>
        <RootStack/>
      </Provider>
    )
  }
}

