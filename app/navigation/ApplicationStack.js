import React from 'react';
import {
    TabNavigator,
    TabBarBottom
} from 'react-navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';

import CommonStyles from '../styles/common';

import StatisticsStack from './SatisticsStack';
import PublicationStack from './PublicationStack';
import HashTagsStack from './HashTagsStack';
import SettingsStack from './SettingsStack';

function getRouteIcon(routeName, focused) {
    let iconName;
    if (routeName === 'Statistics') {
        iconName = `ios-stats${focused ? '' : '-outline'}`;
    } else if (routeName === 'HashTags') {
        iconName = `ios-pricetags${focused ? '' : '-outline'}`;
    } else if (routeName === 'Settings') {
        iconName = `ios-options${focused ? '' : '-outline'}`;
    } else if (routeName === 'Publication') {
        iconName = `ios-images${focused ? '' : '-outline'}`;
    }
    return iconName;
}

export default ApplicationStack = TabNavigator(
{
    Statistics : { screen: StatisticsStack },
    HashTags: { screen: HashTagsStack },
    Publication: { screen: PublicationStack },
    Settings: { screen: SettingsStack }
},
{
    ////// TO REMOVE ONCE FACEBOOK CONNECTION IS BACK ///
    initialRouteName: 'HashTags',
    ////////////////////////////////////////////////////

    navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
            const iconName = getRouteIcon(routeName, focused);    
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
    