import React from 'react';
import {Text} from 'react-native';
import {
    createStackNavigator,
    createBottomTabNavigator
} from 'react-navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';

import CommonStyles from '../styles/common';

import PublicationStack from './PublicationStack';
import HashTagsStack from './HashTagsStack';
import SettingsStack from './SettingsStack';
import ControlDetailsStack from './ControlDetailsStack';
import PublicationFilterScreen from '../screens/PublicationFilterScreen';

function getRouteIcon(routeName, focused) {
    let iconName;
    if (routeName === 'Statistics') {
        iconName = `ios-stats${focused ? '' : '-outline'}`;
    } else if (routeName === 'Hashtags') {
        iconName = `ios-pricetags${focused ? '' : '-outline'}`;
    } else if (routeName === 'Settings') {
        iconName = `ios-options${focused ? '' : '-outline'}`;
    } else if (routeName === 'Publications') {
        iconName = `ios-images${focused ? '' : '-outline'}`;
    }
    return iconName;
}

function getRouteLabel(routeName) {
    let routeCaption;
    if (routeName === 'Statistics') {
        routeCaption = 'Statistics';
    } else if (routeName === 'Hashtags') {
        routeCaption = 'Hashtags';
    } else if (routeName === 'Settings') {
        routeCaption = 'Settings';
    } else if (routeName === 'Publications') {
        routeCaption = 'Publications';
    }
    return routeCaption;
}

const ApplicationNavigator = createBottomTabNavigator(
{
    Hashtags: { screen: HashTagsStack },
    Publications: { screen: PublicationStack },
    Settings: { screen: SettingsStack },
},
{
    initialRouteName: 'Hashtags',
    navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
            const iconName = getRouteIcon(routeName, focused);    
            // You can return any component that you like here! We usually use an
            // icon component from react-native-vector-icons
            return <Ionicons name={iconName} size={25} color={tintColor} />;
        },
        tabBarLabel: () => {
            const { routeName } = navigation.state;
            return <Text style={CommonStyles.styles.tinyLabel}>{getRouteLabel(routeName)}</Text>;    
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
    animationEnabled: false,
    swipeEnabled: false
});

export default Root = createStackNavigator(
{
    ApplicationStack: { screen: ApplicationNavigator },
    ControlDetailsModal: { screen: ControlDetailsStack },
    PublicationFilter: { screen: PublicationFilterScreen }
}
,
{
    initialRouteName: 'ApplicationStack',
    mode: 'modal',
    headerMode: 'none',
});
    