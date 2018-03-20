import React from 'react';
import {
    StackNavigator,
    SwitchNavigator,
    TabNavigator,
    TabBarBottom
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import ConnectionScreen from '../screens/ConnectionScreen';
import UnconnectedHomeScreen from '../screens/UnconnectedHomeScreen';

export default AuthStack = StackNavigator(
    {
        Unconnected: { screen: UnconnectedHomeScreen },
        Connection: { screen: ConnectionScreen },
    },
    {
        initialRouteName: 'Unconnected',
        navigationOptions: NavigationOptions
    });
    