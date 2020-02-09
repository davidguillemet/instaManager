import React from 'react';
import {
    KeyboardAvoidingView,
    SectionList,
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

const TAGS_HEADER_KEY = 'tagsHeader';
const TAGS_FOOTER_KEY = 'tagsFooter';
const INPUT_HEIGHT_PARAM_SUFFIX = 'InputHeight';

class SettingsScreen extends React.PureComponent {
    static navigationOptions = {
        title: 'Settings'
      };

    constructor(props) {
        super(props);

        this.renderSetting = this.renderSetting.bind(this);
        this.renderSection = this.renderSection.bind(this);
        this.renderMaximumTagsCount = this.renderMaximumTagsCount.bind(this);
        this.renderHeaderFooterSetting = this.renderHeaderFooterSetting.bind(this);
        this.renderDisplayErrorSetting = this.renderDisplayErrorSetting.bind(this);
        this.renderNewLineSeparator = this.renderNewLineSeparator.bind(this);
        this.renderActiveProfile = this.renderActiveProfile.bind(this);
        this.setParameter = this.setParameter.bind(this);
        this.clearPublicationHeader = this.clearPublicationHeader.bind(this);
        this.clearPublicationFooter = this.clearPublicationFooter.bind(this);
        this.addFiveDots = this.addFiveDots.bind(this);
        this.navigateToProfiles = this.navigateToProfiles.bind(this);
        
        this.state = {
            maxTagsCount: global.settingsManager.getMaxNumberOfTags(),
            expandedSetting: null,
            displayErrors: global.settingsManager.getDisplayErrors(),
            newLineSeparator: global.settingsManager.getNewLineSeparator()
        }

        this.state[TAGS_HEADER_KEY] = global.settingsManager.getHeader();
        this.state[TAGS_FOOTER_KEY] = global.settingsManager.getFooter();
        this.state[TAGS_HEADER_KEY + INPUT_HEIGHT_PARAM_SUFFIX] = 0;
        this.state[TAGS_FOOTER_KEY + INPUT_HEIGHT_PARAM_SUFFIX] = 0;

        this.settings = [
            {
                title: 'Profiles',
                data: [
                    {
                        key: 'profiles',
                        caption: 'Active Profile',
                        render: this.renderActiveProfile
                    }
                ]
            },
            {
                title: 'Tags Formatting',
                data: [
                    {
                        key: 'maxTagsCount',
                        caption: 'Maximum tags count',
                        render: this.renderMaximumTagsCount,
                        update: (value) => this.setParameter('maxTagsCount', value)
                    },
                    {
                        key: TAGS_HEADER_KEY,
                        caption: 'Publication header',
                        render: this.renderHeaderFooterSetting,
                        update: (value) => this.setParameter(TAGS_HEADER_KEY, value)
                    },
                    {
                        key: TAGS_FOOTER_KEY,
                        caption: 'Publication footer',
                        render: this.renderHeaderFooterSetting,
                        update: (value) => this.setParameter(TAGS_FOOTER_KEY, value)
                    },
                    {
                        key: 'newLineSeparator',
                        caption: 'New line separator',
                        render: this.renderNewLineSeparator,
                        update: (value) => this.setParameter('newLineSeparator', value)
                    }
                ]
            },
            {
                title: 'General Settings',
                data: [
                    {
                        key: 'errors',
                        caption: 'Display errors',
                        render: this.renderDisplayErrorSetting,
                        update: (value) => this.setParameter('displayErrors', value)
                    }
                ]
            }
        ];
    }

    setParameter(settingKey, value) {

        switch (settingKey) {
            case TAGS_HEADER_KEY:
                global.settingsManager.setPublicationHeader(value);
                break;
            case TAGS_FOOTER_KEY:
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
            case 'newLineSeparator':
                global.settingsManager.setNewLineSeparator(value);
                break;
        }
        this.setState({[settingKey]: value});
    }

    addFiveDots() {
        const newHeader = '.\n.\n.\n.\n.';
        this.setParameter(TAGS_HEADER_KEY, newHeader);
    }

    clearPublicationHeader() {
        
        this.setParameter(TAGS_HEADER_KEY, '');
    }

    clearPublicationFooter() {

        this.setParameter(TAGS_FOOTER_KEY, '');
    }

    expandParameter(settingKey) {
        let expandedSetting = null;
        if (this.state.expandedSetting != settingKey) {
            expandedSetting = settingKey;
        }
        this.setState({expandedSetting: expandedSetting});
    }

    navigateToProfiles() {
        this.props.navigation.navigate('ProfileList');
    }

    renderActiveProfile(item) {
        return (
            <View>
                <TouchableOpacity style={styles.settingsListItem} onPress={this.navigateToProfiles}>
                    <Text style={CommonStyles.styles.mediumLabel}>{item.caption}</Text>
                    <Ionicons style={{ color: CommonStyles.TEXT_COLOR }} name={'ios-arrow-forward'} size={CommonStyles.MEDIUM_FONT_SIZE} />
                </TouchableOpacity>
            </View>
        );
    }

    renderHeaderFooterSetting(item) {

        const parameterValue = this.state[item.key];
        const inputHeightParameterName = item.key + INPUT_HEIGHT_PARAM_SUFFIX;
        const clearCallback = item.key == TAGS_HEADER_KEY ? this.clearPublicationHeader : this.clearPublicationFooter;

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
                                item.key == TAGS_HEADER_KEY ?
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

    renderNewLineSeparator(item) {
        return (
            <View style={styles.settingsListItem}>
                <Text style={[CommonStyles.styles.mediumLabel, {flex: 1, marginRight: CommonStyles.GLOBAL_PADDING}]} numberOfLines={1}>{item.caption}</Text>
                <Switch
                    value={this.state.newLineSeparator}
                    onValueChange={item.update}/>
            </View>
        );
    }

    renderSetting({item}) {

        return item.render(item);
    }

    renderSection({section}) {
        return (
            <View style={{ borderLeftColor: CommonStyles.GLOBAL_FOREGROUND, borderLeftWidth: 4 }}>
            <Text style={[CommonStyles.styles.largeLabel, styles.sectionHeader]}>{section.title}</Text>
            </View>
        );
    }

    render() {
        return(
            <KeyboardAvoidingView style={[CommonStyles.styles.standardPage, {padding: 0}]} contentContainerStyle={[CommonStyles.styles.standardPage, {padding: 0}]} behavior={'position'} enabled>
               <SectionList
                    sections={this.settings}
                    extraData={this.state}
                    renderSectionHeader={this.renderSection}
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
    },
    sectionHeader: {
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        paddingVertical: CommonStyles.GLOBAL_PADDING,
        backgroundColor: '#192b48',
        fontWeight: 'bold',
    },
});