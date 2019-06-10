import { StyleSheet } from 'react-native';

export default CommonStyles = {
  
  // Colors
  GLOBAL_BACKGROUND: '#223B62',
  GLOBAL_FOREGROUND: '#406eb7',
  MEDIUM_BACKGROUND: '#2A4E85',
  KPI_COLOR: '#FFFFFF',
  TEXT_COLOR: '#CCCCCC',
  DEACTIVATED_TEXT_COLOR: '#999999',
  SELECTED_TEXT_COLOR: '#FFFFFF',
  PLACEHOLDER_COLOR: '#999999',
  SEPARATOR_COLOR: '#35507A',
  DELETE_COLOR: '#E64545',
  EDIT_COLOR: '#666666',
  WARNING_COLOR: '#F5DC3B',
  ARCHIVE_COLOR: '#96E645',
  DEACTIVATED_SWIPE_ACTION_COLOR: '#666666',
  POSITIVE_DELTA_COLOR: 'green',
  NEGATIVE_DELTA_COLOR: 'red',
  PROFILE_PICTURE_BORDER_COLOR: 'white',
  DARK_GREEN: '#1D7334',
  MEDIUM_GREEN: '#2DCF59',
  LIGHT_GREEN: '#80ED9E',
  LIGHT_RED: '#F29999',
  DARK_RED: '#DE2323',
  DARK_ORANGE: '#E6B446',
  BUTTON_COLOR: '#192b48',
  DEACTIVATED_BUTTON_TEXT_COLOR: '#666666',
  COLOR_TRANSPARENT: '#00000000',

  // Opacity
  NOTIFICATION_OPACITY: 0.8,
  
  // Sizes
  PROFILE_PICTURE_SIZE: 60,
  PROFILE_PICTURE_BORDER_WIDTH: 3,
  BIG_FONT_SIZE: 30,
  LARGE_FONT_SIZE: 25,
  MEDIUM_FONT_SIZE: 20,
  SMALL_FONT_SIZE: 14,
  TINY_FONT_SIZE: 12,
  NAV_ICON_SIZE: 34,
  SWIPE_ICON_SIZE: 25,

  LIST_ITEM_HEIGHT: 40,
  LIST_SEPARATOR_HEIGHT: 1,
  SECTION_HEADER_HEIGHT: 40,
  INDEX_LIST_WIDTH: 20,
  INDEX_ITEM_HEIGHT: 14,
  FOCUSED_ITEM_SIZE: 50,
  WIZARD_BUTTON_SIZE: 40,

  // Fonts
  FONT_NORMAL: 'Arial',
  
  // Radius
  BORDER_RADIUS: 5,
  SEARCH_INPUT_BORDER_RADIUS: 22,

  // Padding
  GLOBAL_PADDING: 10,
  HIERARCHY_INDENT: 30,

  // Swipe
  SWIPE_ACTIVATION_DISTANCE: 120
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
  animatedBottomConfirm: {
    flexDirection: 'row',
    backgroundColor: CommonStyles.LIGHT_GREEN,
    padding: CommonStyles.GLOBAL_PADDING,
  },
  largeLabel: {
    color: CommonStyles.TEXT_COLOR,
    fontSize: CommonStyles.LARGE_FONT_SIZE
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
    backgroundColor: CommonStyles.BUTTON_COLOR,
    color: CommonStyles.TEXT_COLOR,
    fontSize: CommonStyles.MEDIUM_FONT_SIZE,
    padding: CommonStyles.GLOBAL_PADDING,
    borderRadius: CommonStyles.BORDER_RADIUS
  },
  standardButtonCentered: {
    backgroundColor: CommonStyles.BUTTON_COLOR,
    color: CommonStyles.TEXT_COLOR,
    fontSize: CommonStyles.MEDIUM_FONT_SIZE,
    padding: CommonStyles.GLOBAL_PADDING,
    borderRadius: CommonStyles.BORDER_RADIUS,
    justifyContent: 'center',
  },
  navigationButtonIcon: {
    color: CommonStyles.TEXT_COLOR,
    padding: 10,
    paddingTop: 5,
    fontSize: CommonStyles.NAV_ICON_SIZE,
    marginBottom: 5
  },
  textIcon: {
    color: CommonStyles.TEXT_COLOR,
    paddingHorizontal: CommonStyles.GLOBAL_PADDING,
    fontSize: CommonStyles.NAV_ICON_SIZE
  },
  swipeButtonIcon: {
    color: CommonStyles.TEXT_COLOR,
    padding: 10,
    paddingTop: 7,
    fontSize: CommonStyles.SWIPE_ICON_SIZE
  },
  sectionHeaderContainer: {
    flex: 1,
    justifyContent: 'center',
    height: CommonStyles.SECTION_HEADER_HEIGHT,
    backgroundColor: CommonStyles.BUTTON_COLOR
  },
  sectionHeader: {
    color: CommonStyles.TEXT_COLOR,
    fontSize: CommonStyles.MEDIUM_FONT_SIZE,
    paddingHorizontal: CommonStyles.GLOBAL_PADDING
  },
  singleListItemContainer: {
    height: CommonStyles.LIST_ITEM_HEIGHT,
  },
  singleListItem:  {
    color: CommonStyles.TEXT_COLOR,
    fontSize: CommonStyles.MEDIUM_FONT_SIZE,
    paddingHorizontal: CommonStyles.GLOBAL_PADDING
  },
  singleSelectedListItem:  {
    color: CommonStyles.SELECTED_TEXT_COLOR,
    fontSize: CommonStyles.MEDIUM_FONT_SIZE,
    paddingHorizontal: CommonStyles.GLOBAL_PADDING
  },
  deacivatedSingleListItem:  {
    color: CommonStyles.DEACTIVATED_TEXT_COLOR,
    fontSize: CommonStyles.MEDIUM_FONT_SIZE,
    paddingHorizontal: CommonStyles.GLOBAL_PADDING,
  }
});
  