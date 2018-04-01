import React from 'react';
import {
    StackNavigator
} from 'react-navigation';

import NavigationOptions from '../styles/navigation';

import HashTagsHomeScreen from '../screens/HashTagsHomeScreen';
import HashTagImportScreen from '../screens/HashTagsImportScreen';

export default HashTagsStack = StackNavigator(
    {
        HashTagsHome: { screen: HashTagsHomeScreen },
        HashTagsImport: { screen: HashTagImportScreen }
    },
    {
        initialRouteName: 'HashTagsHome',
        navigationOptions: NavigationOptions
    });
    