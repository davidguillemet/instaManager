import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Alert
} from 'react-native';
import PropTypes from 'prop-types';
import CommonStyles from '../styles/common';

export default class CustomButton extends React.PureComponent {

    static propTypes = {
        title: PropTypes.string.isRequired,     // Button caption
        deactivated: PropTypes.bool,            // true if the button is deactivated - optional
        onPress: PropTypes.func.isRequired,     // callback when the button is pressed if not deactivated
        showActivityIndicator: PropTypes.bool,  // true if we show the activity indicator when the button is pressed - optional - false by default
        running: PropTypes.bool,                // true if the action is running
        register: PropTypes.array                // array for registering the current button to calback setActionCompleted()
    };

    static defaultProps = {
        deactivated: false,        // by default, the button is activated
        showActivityIndicator: false,
        running: false,
        register: null
    };

    constructor(props) {
        super(props);

        this.state = {
            running: this.props.running
        }

        if (this.props.register != null) {
            this.props.register.push(this);
        }

        this.onPress = this.onPress.bind(this);
    }

    onPress() {

        if (this.props.showActivityIndicator) {
            this.setState({
                running: true
            });
        }
        this.props.onPress();
    }

    setActionCompleted() {

        if (this.props.showActivityIndicator) {
            this.setState({
                running: false
            });
        }
    }

    render() {

        let globalStyle = this.props.style ? StyleSheet.flatten(this.props.style) : {};

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
        
        const disabled = this.props.deactivated || this.state.running;

        let finalColor =
            disabled ?
            CommonStyles.DEACTIVATED_BUTTON_TEXT_COLOR :
            color ? color : CommonStyles.TEXT_COLOR;

        const textStyle = {
            color: finalColor,
            fontSize: fontSize ? fontSize : CommonStyles.MEDIUM_FONT_SIZE
        };

        return (
            <TouchableOpacity style={touchableStyle} onPress={this.onPress} disabled={disabled}>
                {
                    this.state.running ?
                    <ActivityIndicator style={{ marginRight: 10 }} color={'white'} />
                    :
                    null
                }
                <Text style={textStyle}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
}
