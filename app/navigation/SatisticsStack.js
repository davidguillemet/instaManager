import React from 'react';
import {
    StackNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import HomeScreen from '../screens/HomeScreen';

export default StatisticsStack = StackNavigator(
    {
        Home: { screen: HomeScreen }
    },
    {
        initialRouteName: 'Home',
        navigationOptions: NavigationOptions
    });
    