import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
  } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

  
/**
 * - id = tag identifier
 * - name = tag name
 * - readOnly = true if the display is readonly, what means we cannot remove the tag
 * - onPress = callback when the tag is deleted (if not readonly)
 * - iconName = name of the icon to display
 */
export default class Tag extends React.PureComponent {

    constructor(props) {
        super(props);

        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        if (this.props.onPress != null) {
            this.props.onPress(this.props.id);
        }
    }

    render() {
        
        const defaultTagStyle = StyleSheet.flatten(styles.defaultTagStyle);
        const tagStylefromProps = StyleSheet.flatten(this.props.style);
        const composedTagStyle = { ...defaultTagStyle, ...tagStylefromProps };

        return (
            <View style={styles.container}>
                <TouchableOpacity
                  style={composedTagStyle}
                  onPress={this.onPress}
                  disabled={this.props.onPress == null}
                >
                    <Text style={styles.title} numberOfLines={1}>{this.props.name}</Text>
                    {
                        this.props.onPress == null ?
                        null
                        :
                        <Ionicons style={{color: '#FFF'}} name={this.props.iconName} size={20} />
                    }
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    defaultTagStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderRadius: 8,
        borderWidth: 1,
        paddingLeft: CommonStyles.GLOBAL_PADDING,
        paddingRight: 5,
        paddingVertical: 3
    },
    container: {
      marginRight: 6
    },
    title: {
      color: '#FFFFFF',
      fontFamily: 'Avenir',
      fontSize: 15,
      fontWeight: 'normal',
      paddingRight: 5,
      maxWidth: 200 // TODO: manage very long tags in a more dynamic way...
    },
};