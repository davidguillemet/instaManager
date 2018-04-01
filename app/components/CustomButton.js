import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Alert
} from 'react-native';
import CommonStyles from '../styles/common';

export default class CustomButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let globalStyle = StyleSheet.flatten(this.props.style);
        let touchableStyle = {
            backgroundColor: globalStyle && globalStyle.backgroundColor ? globalStyle.backgroundColor : CommonStyles.GLOBAL_FOREGROUND,
            paddingVertical: globalStyle && globalStyle.padding ? globalStyle.padding : CommonStyles.GLOBAL_PADDING,
            paddingHorizontal: globalStyle && globalStyle.padding ? globalStyle.padding * 2 : CommonStyles.GLOBAL_PADDING * 2,
            borderRadius: globalStyle && globalStyle.borderRadius ? globalStyle.borderRadius : CommonStyles.BORDER_RADIUS,
            marginBottom: CommonStyles.GLOBAL_PADDING,
        };

        if (globalStyle && globalStyle.marginTop) {
            touchableStyle = { ...touchableStyle, marginTop: globalStyle.marginTop };
        }

        const textStyle = {
            color: globalStyle && globalStyle.color ? globalStyle.color : CommonStyles.TEXT_COLOR,
            fontSize: globalStyle && globalStyle.fontSize ? globalStyle.fontSize : CommonStyles.MEDIUM_FONT_SIZE
        };

        return (
            <TouchableOpacity style={touchableStyle} onPress={this.props.onPress}>
                <Text style={textStyle}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
}
