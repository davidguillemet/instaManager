import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Alert
} from 'react-native';
import CommonStyles from '../styles/common';

export default class CustomButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let globalStyle = StyleSheet.flatten(this.props.style);

        const defaultStyle = {
            flexDirection: 'row',
            backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
            paddingVertical: CommonStyles.GLOBAL_PADDING,
            paddingHorizontal: CommonStyles.GLOBAL_PADDING * 2,
            borderRadius: CommonStyles.BORDER_RADIUS,
            borderColor: CommonStyles.GLOBAL_FOREGROUND,
            borderWidth: 0,
            marginBottom: CommonStyles.GLOBAL_PADDING
        };

        let { color, fontSize, ...allOtherStyles } = globalStyle;

        let touchableStyle = { ...defaultStyle, ...allOtherStyles };
        
        const textStyle = {
            color: color ? color : CommonStyles.TEXT_COLOR,
            fontSize: fontSize ? fontSize : CommonStyles.MEDIUM_FONT_SIZE
        };

        if (this.props.deactivated) {
            return (
                <View style={touchableStyle}>
                    <Text style={textStyle}>{this.props.title}</Text>
                </View>
            );
        }
        else {
            return (
                <TouchableOpacity style={touchableStyle} onPress={this.props.onPress}>
                    <Text style={textStyle}>{this.props.title}</Text>
                </TouchableOpacity>
            );
        }
    }
}
