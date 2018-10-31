import React from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import PropTypes from 'prop-types';
import CommonStyles from '../styles/common';
import Ionicons from 'react-native-vector-icons/Ionicons';

const defaultMinValue = 0;
const defaultMaxValue = 100;
const defaultStep = 1;

export default class NumericInput extends React.PureComponent {

    static propTypes = {
        value: PropTypes.number.isRequired,
        minValue: PropTypes.number.isRequired,
        maxValue: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        onValueChange: PropTypes.func
    };

    static defaultProps = {
        value: defaultMinValue,
        minValue: defaultMinValue,
        maxValue: defaultMaxValue,
        step: defaultStep
    };

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value.toString()
        }

        this.onValueChange = this.onValueChange.bind(this);
        this.onIncrementValue = this.onIncrementValue.bind(this);
        this.onDecrementValue = this.onDecrementValue.bind(this);
    }

    changeValueCallback(value) {

        if (this.props.onValueChange) {
            this.props.onValueChange(value);
        }
    }

    onValueChange(text) {
        
        const numericValue = text.replace(/[^0-9]/g, '');
        this.setState({value: numericValue});

        this.changeValueCallback(parseInt(numericValue));
    }

    onIncrementValue() {
        this.changeValue(this.props.step);
    }

    onDecrementValue() {
        this.changeValue(-this.props.step);
    }

    changeValue(offset) {
        const previousValue = parseInt(this.state.value);
        const newValue = previousValue + offset;
        this.setState({value: newValue.toString()});
        this.changeValueCallback(newValue);
    }

    render() {

        const decrementDisabled = this.state.value <= this.props.minValue;
        const incrementDisabled = this.state.value >= this.props.maxValue;
        const decrementStyles = [
            styles.incrementButton,
            styles.leftIncrementButton
        ];
        const incrementStyles = [
            styles.incrementButton,
            styles.rightIncrementButton
        ];

        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                        style={decrementStyles}
                        onPress={this.onDecrementValue}
                        disabled={decrementDisabled}>
                    <Ionicons key={'icon'} style={{color: decrementDisabled ? CommonStyles.DEACTIVATED_BUTTON_TEXT_COLOR : CommonStyles.TEXT_COLOR}} name={'ios-remove'} size={25} />
                </TouchableOpacity>
                <TextInput 
                    style={styles.textInput}
                    value={this.state.value}
                    onChangeText={this.onValueChange}
                    keyboardType={'numeric'}
                    multiline = {false}
                />
                <TouchableOpacity
                        style={incrementStyles}
                        onPress={this.onIncrementValue}
                        disabled={incrementDisabled}>
                    <Ionicons key={'icon'} style={{color: incrementDisabled ? CommonStyles.DEACTIVATED_BUTTON_TEXT_COLOR : CommonStyles.TEXT_COLOR}} name={'ios-add'} size={25} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        width: 60,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        color: CommonStyles.TEXT_COLOR
    },
    incrementButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        backgroundColor: CommonStyles.BUTTON_COLOR,
        width: 30
    },
    leftIncrementButton: {
        borderTopLeftRadius: CommonStyles.BORDER_RADIUS,
        borderBottomLeftRadius: CommonStyles.BORDER_RADIUS
    },
    rightIncrementButton: {
        borderTopRightRadius: CommonStyles.BORDER_RADIUS,
        borderBottomRightRadius: CommonStyles.BORDER_RADIUS
    },
    buttonDisabled: {
        color: CommonStyles.DEACTIVATED_BUTTON_TEXT_COLOR
    }
});