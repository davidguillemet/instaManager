import React, { PureComponent } from 'react';
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
        this.props.onPress(this.props.id);
    }

    render() {
        let tagStyle = StyleSheet.flatten(this.props.style);
        return (
            <View style={styles.container}>
                <TouchableOpacity
                  style={tagStyle}
                  onPress={this.onPress}
                >
                    <Text style={styles.title}>{this.props.name}</Text>
                    <Ionicons style={{color: '#FFF'}} name={this.props.iconName} size={20} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    container: {
      marginRight: 6,
      height: 40
    },
    title: {
      color: '#FFFFFF',
      fontFamily: 'Avenir',
      fontSize: 15,
      fontWeight: 'normal',
      paddingRight: 5
    },
};