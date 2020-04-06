import React from 'react';
import {
    createStackNavigator,
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import ConnectionScreen from '../screens/ConnectionScreen';
import UnconnectedHomeScreen from '../screens/UnconnectedHomeScreen';

export default AuthStack = createStackNavigator(
    {
        Unconnected: { screen: UnconnectedHomeScreen },
        Connection: { screen: ConnectionScreen },
    },
    {
        initialRouteName: 'Unconnected',
        defaultNavigationOptions: NavigationOptions
    });
    