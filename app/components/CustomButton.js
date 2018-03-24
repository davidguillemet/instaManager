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
        const touchableStyle = {
            backgroundColor: globalStyle.backgroundColor,
            paddingVertical: globalStyle.padding,
            paddingHorizontal: globalStyle.padding * 2,
            borderRadius: globalStyle.borderRadius,
            marginBottom: CommonStyles.GLOBAL_PADDING
        };
        const textStyle = {
            color: globalStyle.color,
            fontSize: globalStyle.fontSize
        };

        return (
            <TouchableOpacity style={touchableStyle} onPress={this.props.onPress}
            >
                <Text style={textStyle}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
}
