import { StyleSheet } from 'react-native';

export default CommonStyles = {
  
  // Colors
  GLOBAL_BACKGROUND: '#223B62',
  GLOBAL_FOREGROUND: '#406eb7',
  KPI_COLOR: '#FFFFFF',
  TEXT_COLOR: '#CCCCCC',
  SEPARATOR_COLOR: '#666666',
  POSITIVE_DELTA_COLOR: 'green',
  NEGATIVE_DELTA_COLOR: 'red',
  PROFILE_PICTURE_BORDER_COLOR: 'white',
  
  // Sizes
  PROFILE_PICTURE_SIZE: 60,
  PROFILE_PICTURE_BORDER_WIDTH: 3,
  BIG_FONT_SIZE: 30,
  MEDIUM_FONT_SIZE: 20,
  SMALL_FONT_SIZE: 14,
  NAV_ICON_SIZE: 30,

  // Fonts
  FONT_NORMAL: 'Arial',
  
  // Radius
  BORDER_RADIUS: 5,
  SEARCH_INPUT_BORDER_RADIUS: 15,

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
    color: CommonStyles.TEXT_COLOR,
    fontSize: CommonStyles.MEDIUM_FONT_SIZE
  },
  smallLabel: {
    color: CommonStyles.TEXT_COLOR,
    fontSize: CommonStyles.SMALL_FONT_SIZE
  },
  standardButton: {
    backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
    color: CommonStyles.TEXT_COLOR,
    fontSize: CommonStyles.MEDIUM_FONT_SIZE,
    padding: CommonStyles.GLOBAL_PADDING,
    borderRadius: CommonStyles.BORDER_RADIUS
  },
  navigationButtonIcon: {
    color: CommonStyles.TEXT_COLOR,
    padding: 10,
    paddingTop: 20,
    fontSize: CommonStyles.NAV_ICON_SIZE
  }
});
  