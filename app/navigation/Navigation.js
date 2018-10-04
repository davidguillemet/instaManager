import React from 'react';
import {
    SwitchNavigator
} from 'react-navigation';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import ApplicationStack from './ApplicationStack';
import AuthenticationStack from './AuthenticationStack';

export default ApplicationStack;

// export default RootStack = SwitchNavigator(
// {
//     AuthLoading: AuthLoadingScreen,
//     AppStack: ApplicationStack,
//     AuthStack: AuthenticationStack,
// },
// {
//     //initialRouteName: 'AuthLoading',
//     initialRouteName: 'AppStack',
// });