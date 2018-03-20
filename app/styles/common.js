import { StyleSheet } from 'react-native';

export default CommonStyles = {
  
  // Colors
  GLOBAL_BACKGROUND: '#223B62',
  GLOBAL_FOREGROUND: '#406eb7',
  TEXT_COLOR: '#CCCCCC',
  KPI_COLOR: '#FFFFFF',
  POSITIVE_DELTA_COLOR: 'green',
  NEGATIVE_DELTA_COLOR: 'red',
  PROFILE_PICTURE_BORDER_COLOR: 'white',
  
  // Sizes
  PROFILE_PICTURE_SIZE: 60,
  PROFILE_PICTURE_BORDER_WIDTH: 3,
  BIG_FONT_SIZE: 30,
  MEDIUM_FONT_SIZE: 20,
  SMALL_FONT_SIZE: 14,

  // Fonts
  FONT_NORMAL: 'Arial',
  
  // Radius
  BORDER_RADIUS: 5,

  // Padding
  GLOBAL_PADDING: 10
}

  // Predifined StyleSheet:
CommonStyles.styles = StyleSheet.create(
{
  standardPage: {
      flex: 1,
      backgroundColor: CommonStyles.GLOBAL_BACKGROUND,
      padding: CommonStyles.GLOBAL_PADDING,
  },
  standardTile: {
      flexDirection: 'row',
      backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
      borderRadius: CommonStyles.BORDER_RADIUS,
      marginBottom: CommonStyles.GLOBAL_PADDING,
      padding: CommonStyles.GLOBAL_PADDING,
  },
  mediumLabel: {
    flex: 1,
    color: CommonStyles.TEXT_COLOR,
    fontSize: CommonStyles.MEDIUM_FONT_SIZE
  },
});
  