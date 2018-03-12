import { StyleSheet } from 'react-native';
import CommonStyles from '../../styles/common';

export default StyleSheet.create({
    mainBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: CommonStyles.GLOBAL_BACKGROUND
    },
    welcome: {
      fontSize: 24,
      fontFamily: CommonStyles.FONT_NORMAL,
      textAlign: 'center',
      color: 'white',
      margin: 10,
    },
    buttonConnect: {
      textAlign: 'center',
      fontFamily: CommonStyles.FONT_NORMAL,
      color: '#333333',
      marginBottom: 5,
    },
  });