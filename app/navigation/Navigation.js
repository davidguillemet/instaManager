import React from 'react';
import {
    StackNavigator,
    SwitchNavigator,
    TabNavigator,
    TabBarBottom
} from 'react-navigation';

import NavigationStyles from '../styles/navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';

import StatisticsStack from './SatisticsStack';
import HashTagsStack from './HashTagsStack';
import SettingsStack from './SettingsStack';
import AuthenticationStack from './AuthenticationStack';

const ApplicationStack = TabNavigator(
{
    Statistics : { screen: StatisticsStack },
    HashTags: { screen: HashTagsStack },
    Settings: { screen: SettingsStack }
},
{
    navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
            let iconName;
            if (routeName === 'Statistics') {
                iconName = `ios-stats${focused ? '' : '-outline'}`;
            } else if (routeName === 'HashTags') {
                iconName = `ios-pricetags${focused ? '' : '-outline'}`;
            } else if (routeName === 'Settings') {
                iconName = `ios-options${focused ? '' : '-outline'}`;
            }
    
            // You can return any component that you like here! We usually use an
            // icon component from react-native-vector-icons
            return <Ionicons name={iconName} size={25} color={tintColor} />;
        }
    }),
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: '#bbbbbb',
      style: {
        backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
      },
      showIcon: true
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
});

export default RootStack = SwitchNavigator(
{
    AuthLoading: AuthLoadingScreen,
    AppStack: ApplicationStack,
    AuthStack: AuthenticationStack,
},
{
    initialRouteName: 'AuthLoading',
});