// import React from 'react';
import {
    createSwitchNavigator,
    createAppContainer
} from 'react-navigation';

//import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import ApplicationStack from './ApplicationStack';
//import AuthenticationStack from './AuthenticationStack';

export default createAppContainer(ApplicationStack);

// export default RootStack = createSwitchNavigator(
// {
//     AuthLoading: AuthLoadingScreen,
//     AppStack: ApplicationStack,
//     AuthStack: AuthenticationStack,
// },
// {
//     //initialRouteName: 'AuthLoading',
//     initialRouteName: 'AppStack',
// });