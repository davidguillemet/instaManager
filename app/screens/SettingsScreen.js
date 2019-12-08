import React from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
    Text
} from 'react-native';

import { connect } from 'react-redux';
import { createSetDisplayErrorsAction, launchControls } from './../actions';

import CommonStyles from '../styles/common';
import ListItemSeparator from '../components/ListItemSeparator';
import NumericInput from '../components/NumericInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';

class SettingsScreen extends React.PureComponent {
    static navigationOptions = {
        title: 'Settings'
      };

    constructor(props) {
        super(props);

        this.renderSetting = this.renderSetting.bind(this);
        this.renderMaximumTagsCount = this.renderMaximumTagsCount.bind(this);
        this.renderHeaderFooterSetting = this.renderHeaderFooterSetting.bind(this);
        this.renderDisplayErrorSetting = this.renderDisplayErrorSetting.bind(this);
        this.setParameter = this.setParameter.bind(this);
        this.clearPublicationHeader = this.clearPublicationHeader.bind(this);
        this.clearPublicationFooter = this.clearPublicationFooter.bind(this);
        this.addFiveDots = this.addFiveDots.bind(this);
        
        this.state = {
            maxTagsCount: global.settingsManager.getMaxNumberOfTags(),
            header: global.settingsManager.getHeader(),
            footer: global.settingsManager.getFooter(),
            expandedSetting: null,
            headerInputHeight: 0,
            footerInputHeight: 0,
            displayErrors: global.settingsManager.getDisplayErrors()
        }

        this.settings = [
            {
                key: 'maxTagsCount',
                caption: 'Maximum tags count',
                render: this.renderMaximumTagsCount,
                update: (value) => this.setParameter('maxTagsCount', value)
            },
            {
                key: 'header',
                caption: 'Publication header',
                render: this.renderHeaderFooterSetting,
                update: (value) => this.setParameter('header', value)
            },
            {
                key: 'footer',
                caption: 'Publication footer',
                render: this.renderHeaderFooterSetting,
                update: (value) => this.setParameter('footer', value)
            },
            {
                key: 'errors',
                caption: 'Display errors',
                render: this.renderDisplayErrorSetting,
                update: (value) => this.setParameter('displayErrors', value)
            }
        ];
    }

    setParameter(settingKey, value) {

        this.setState({[settingKey]: value});
        switch (settingKey) {
            case 'header':
                global.settingsManager.setPublicationHeader(value);
                break;
            case 'footer':
                global.settingsManager.setPublicationFooter(value);
                break;
            case 'maxTagsCount':
                global.settingsManager.setMaximumNumberOfTags(value);
                this.props.onLaunchControls();
                break;
            case 'displayErrors':
                global.settingsManager.setDisplayErrors(value);
                this.props.onSetDisplayErrors(value);
                break;
            }
    }

    addFiveDots() {
        const newHeader = '.\n.\n.\n.\n.\n' + this.state.header;
        this.setParameter('header', newHeader);
    }

    clearPublicationHeader() {
        
        this.setParameter('header', '');
    }

    clearPublicationFooter() {

        this.setParameter('footer', '');
    }

    expandParameter(settingKey) {
        let expandedSetting = null;
        if (this.state.expandedSetting != settingKey) {
            expandedSetting = settingKey;
        }
        this.setState({expandedSetting: expandedSetting});
    }

    renderHeaderFooterSetting(item) {

        const parameterValue = item.key == 'header' ? this.state.header : this.state.footer;
        const inputHeightParameterName = `${item.key}InputHeight`;
        const clearCallback = item.key == 'header' ? this.clearPublicationHeader : this.clearPublicationFooter;

        return (
            <View>
                <TouchableOpacity style={styles.settingsListItem} onPress={() => this.expandParameter(item.key)}>
                    <Text style={CommonStyles.styles.mediumLabel}>{item.caption}</Text>
                    <Ionicons style={{ color: CommonStyles.TEXT_COLOR }} name={this.state.expandedSetting == item.key ? 'ios-arrow-down' : 'ios-arrow-forward'} size={CommonStyles.MEDIUM_FONT_SIZE} />
                </TouchableOpacity>
                {
                    this.state.expandedSetting == item.key ?
                    <View style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: CommonStyles.SEPARATOR_COLOR,
                            borderRadius: CommonStyles.BORDER_RADIUS,
                            margin: CommonStyles.GLOBAL_PADDING,
                            marginLeft: CommonStyles.GLOBAL_PADDING*2,
                            marginTop: 0,
                            backgroundColor: CommonStyles.BUTTON_COLOR
                        }} >
                        <TextInput
                            multiline={true}
                            autoFocus={true}
                            height={Math.max(35, this.state[inputHeightParameterName])}
                            value={parameterValue}
                            onChangeText={item.update}
                            onContentSizeChange={(event) => {
                                this.setState({ [inputHeightParameterName]: event.nativeEvent.contentSize.height })
                            }}
                            style={{
                                margin: CommonStyles.GLOBAL_PADDING,
                                color: CommonStyles.TEXT_COLOR,
                                fontSize: CommonStyles.MEDIUM_FONT_SIZE
                            }}
                        />
                        <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: CommonStyles.GLOBAL_PADDING/2,
                                backgroundColor: CommonStyles.SEPARATOR_COLOR
                            }}>
                            {
                                item.key == 'header' ?
                                <CustomButton title={'[...] Collapsible comment'} onPress={this.addFiveDots} style={
                                    [
                                        CommonStyles.styles.smallLabel,
                                        {
                                            paddingHorizontal: CommonStyles.GLOBAL_PADDING,
                                            paddingVertical: CommonStyles.GLOBAL_PADDING/2,
                                            marginBottom: 0,
                                            marginRight: CommonStyles.GLOBAL_PADDING
                                        }
                                    ]}
                                />
                                :
                                <View></View>
                            }
                            <TouchableOpacity onPress={clearCallback} style={{overflow: 'hidden'}}>
                                <Ionicons style={{ color: CommonStyles.TEXT_COLOR, marginTop: 4 }} name={'ios-close-circle'} size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    : null
                }
            </View>
        );
    }

    renderMaximumTagsCount(item) {
        return (
            <View style={styles.settingsListItem}>
                <Text style={[CommonStyles.styles.mediumLabel, {flex: 1, marginRight: CommonStyles.GLOBAL_PADDING}]} numberOfLines={1}>{item.caption}</Text>
                <NumericInput
                    value={this.state.maxTagsCount}
                    minValue={1}
                    maxValue={1000}
                    step={1}
                    onValueChange={item.update}/>
            </View>
        );
    }

    renderDisplayErrorSetting(item) {
        return (
            <View style={styles.settingsListItem}>
                <Text style={[CommonStyles.styles.mediumLabel, {flex: 1, marginRight: CommonStyles.GLOBAL_PADDING}]} numberOfLines={1}>{item.caption}</Text>
                <Switch
                    value={this.state.displayErrors}
                    onValueChange={item.update}/>
            </View>
        );
    }

    renderSetting({item}) {

        return item.render(item);
    }

    render() {
        return(
            <KeyboardAvoidingView style={[CommonStyles.styles.standardPage, {padding: 0}]} contentContainerStyle={CommonStyles.styles.standardPage} behavior={'position'} enabled>
               <FlatList
                    data={this.settings}
                    extraData={this.state}
                    renderItem={this.renderSetting}
                    ItemSeparatorComponent={ListItemSeparator}
                    indicatorStyle={'white'}
                />
            </KeyboardAvoidingView>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLaunchControls: () => {
            dispatch(launchControls());
        },
        onSetDisplayErrors: (value) => {
            dispatch(createSetDisplayErrorsAction(value));
        }
    }
}

export default connect(null, mapDispatchToProps)(SettingsScreen);

const styles = StyleSheet.create({
    settingsListItem: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: CommonStyles.GLOBAL_PADDING
    }
});