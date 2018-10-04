import React from 'react';
import {
  TouchableOpacity,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonStyles from '../styles/common';


export default NavigationOptions = ({ navigation }) => {
  return {
    headerStyle: {
      backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
      borderBottomWidth: 2,
      borderColor: CommonStyles.SEPARATOR_COLOR
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerLeft: (
      <View style={{ flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => navigation.goBack(null)}><Ionicons name={'ios-arrow-back'} style={CommonStyles.styles.navigationButtonIcon}/></TouchableOpacity>
      </View>
      )
  };
};
