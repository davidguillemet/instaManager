import React from 'react';
import {
    StyleSheet,
    Switch,
    View,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

import CommonStyles from './../styles/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Flag from './Flag';

class ParameterName extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        let parameterName = this.props.name;
        if (this.props.mandatory) {
            parameterName += '*';
        }
        const styleArray = [];
        styleArray.push(CommonStyles.styles.smallLabel);
        styleArray.push(styles.parameterLabel);
        if (this.props.mandatory) {
            styleArray.push({fontWeight: 'bold'});
        }
        return (
            <Text style={styleArray}>{parameterName}</Text>
        );
    }
}

class TextParameter extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.parameterContainerView}>
                <ParameterName {...this.props} />
                <TextInput
                    defaultValue={this.props.value}
                    autoFocus={this.props.focus}
                    keyboardType='default'
                    style={styles.parameterInput}
                    placeholder={this.props.placeholder}
                    selectionColor={CommonStyles.TEXT_COLOR}
                    placeholderTextColor={CommonStyles.PLACEHOLDER_COLOR}
                    clearButtonMode={'always'}
                    onChangeText={this.props.onChange}
                    autoCapitalize='none'
                    returnKeyType={'done'}
                    textContentType={'none'}
                    autoCorrect={false}
                    blurOnSubmit={true}
                />
            </View>
        );
    }
}

class SelectParameter extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={styles.parameterContainerView}>
                <ParameterName {...this.props} />
                <TouchableOpacity onPress={this.props.onClick} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                        style={this.props.value ? styles.parameterInput : styles.parentParameter }
                        numberOfLines={1}
                    >
                        {this.props.value || this.props.placeholder}
                    </Text>
                    <Ionicons name={'ios-arrow-forward'} style={[CommonStyles.styles.textIcon, styles.iconSelect]}/>
                    {
                        this.props.count ?
                        <Flag caption={this.props.count} style={{
                            position: 'absolute',
                            right: 30,
                            top: -3,
                        }}/>
                        : null
                    }
                </TouchableOpacity>
            </View>
        );
    }
}

class BooleanParameter extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[CommonStyles.styles.mediumLabel, styles.parameterLabel, {fontWeight: 'bold'}]}>{this.props.name}</Text>
                <Switch
                    value={this.props.value}
                    onValueChange={this.props.onChange}
                    disabled={this.props.disabled}/>
            </View>
        );
    }
}

export default class Form extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    renderParameter(parameter) {
        switch (parameter.type) {
            case 'text':
                return <TextParameter key={parameter.name} {...parameter}/>;
            case 'select':
                return <SelectParameter key={parameter.name} {...parameter}/>;
            case 'boolean':
                return <BooleanParameter key={parameter.name} {...parameter}/>
        }
    }

    render() {
        return (
            <View>
            {
                this.props.parameters.map((parameter, index) => {
                    const parameterComponent = this.renderParameter(parameter);
                    const componentArray = [
                        parameterComponent
                    ];
                    if (index < this.props.parameters.length - 1) {
                        componentArray.push(<View key={`separator ${parameter.name}`} style={styles.parameterSeparator}></View>);
                    }
                    return componentArray;
                })
            }
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    parameterContainerView: {
        flexDirection: 'column'
    },
    parameterSeparator: {
        backgroundColor: CommonStyles.SEPARATOR_COLOR,
        height: 1,
        marginBottom: CommonStyles.GLOBAL_PADDING
    },
    parameterInput: {
        flex: 1,
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        color: CommonStyles.KPI_COLOR,
        padding: CommonStyles.GLOBAL_PADDING
    },
    parameterLabel: {
        flex: 1,
        paddingLeft: CommonStyles.GLOBAL_PADDING,
        fontStyle: 'italic'
    },
    parentParameter: {
        flex: 1,
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        color: CommonStyles.PLACEHOLDER_COLOR,
        padding: CommonStyles.GLOBAL_PADDING
    },
    iconSelect: {
        color: CommonStyles.PLACEHOLDER_COLOR,
    }
});
    