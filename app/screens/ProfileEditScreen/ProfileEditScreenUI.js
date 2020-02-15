import React from 'react';
import {
    Alert,
    Animated,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import CommonStyles from '../../styles/common';
import CustomButton from '../../components/CustomButton';

export default class ProfileEditScreenUi extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dirty: false,
            profileName: this.props.profileName,
            profileDesc: this.props.profileDesc
        };
        this.onChangeProfileName = this.onChangeProfileName.bind(this);
        this.onChangeProfileDesc = this.onChangeProfileDesc.bind(this);
        this.onSaveItem = this.onSaveItem.bind(this);
        this.onQuit = this.onQuit.bind(this);
        this.isDirty = this.isDirty.bind(this);

        this.saveContainerAnimatedHeight = new Animated.Value(0);
        this.saveContainerVisible = false;

        this.saveSubscriber = [];
    }

    onQuit() {
        Keyboard.dismiss();
        this.props.navigation.goBack(null);
    }

    onSaveItem() {

        const profileName = this.state.profileName.trim();
        const profileDesc = this.state.profileDesc.trim();

        if (this.validateProfile(profileName) == false) {
            this.saveSubscriber.forEach(listener => listener.setActionCompleted());
            return;
        }

        const profileToSave = {
            id: this.props.profileId,
            name: profileName,
            description: profileDesc
        };

        this.props.onSaveProfile(profileToSave, this.props.editorMode === global.UPDATE_MODE);
        this.onQuit();
    }
    
    validateProfile(profileName) {
        
        // 1. Check the profile name has been entered
        if (profileName == null || profileName.length == 0) {
            Alert.alert('', `Please enter a Profile name.`);
            return false;
        }
        
        // 3. Check category does not already exist
        const profilesWithSameName = global.hashtagUtil.searchProfile(profileName);
        let nameAlreadyExists = false;
        if (profilesWithSameName.length > 0) {
            
            if (this.props.editorMode == global.CREATE_MODE) {

                // Create mode = error as soon as a profile exists with the same name in the database
                nameAlreadyExists = true;

            } else {

                // Edition mode = error as soon as a profile with another id exists with the same name in the database
                for (let item of itemsWithSameName) {
                    if (item.id !== this.props.profileId) {
                        nameAlreadyExists = true;
                        break;
                    }
                }
            }
        }
        
        if (nameAlreadyExists === true) {
            Alert.alert('', `The Profile '${profileName}' already exists.`);
            return false;
        }

        return true;
    }

    onChangeProfileName(text) {
                
        this.setState({
            dirty: true,
            profileName: text
        });
    }

    onChangeProfileDesc(text) {
                
        this.setState({
            dirty: true,
            profileDesc: text
        });
    }
    
    isDirty() {
        return this.state.dirty && this.state.profileName.trim().length > 0;
    }

    render() {

        if (this.isDirty() && this.saveContainerVisible == false) {
            this.saveContainerVisible = true;
            Animated.timing(
                this.saveContainerAnimatedHeight,
                {
                    toValue: 60,
                    duration: 200
                }
            ).start();
        } else if (this.isDirty() == false && this.saveContainerVisible == true) {
            this.saveContainerVisible = false;
            Animated.timing(
                this.saveContainerAnimatedHeight,
                {
                    toValue: 0,
                    duration: 200
                }
            ).start();
        }

        return (
            <View style={[CommonStyles.styles.standardPage, { padding: 0 }]}>
                <ScrollView style={[
                                CommonStyles.styles.standardPage, 
                                {
                                    padding: CommonStyles.GLOBAL_PADDING
                                }
                            ]} indicatorStyle={'white'}>
                    <View style={styles.parameterContainerView}>
                        <Text style={[CommonStyles.styles.smallLabel, styles.parameterLabel, {fontWeight: 'bold'}]}>Name *</Text>
                        <TextInput
                            defaultValue={this.state.itemName}
                            autoFocus={this.props.editorMode == global.CREATE_MODE}
                            keyboardType='default'
                            style={styles.parameterInput}
                            placeholder={`Enter a Profile name`}
                            selectionColor={CommonStyles.TEXT_COLOR}
                            placeholderTextColor={CommonStyles.PLACEHOLDER_COLOR}
                            clearButtonMode={'always'}
                            onChangeText={this.onChangeProfileName}
                            autoCapitalize='none'
                            returnKeyType={'done'}
                            textContentType={'none'}
                            autoCorrect={false}
                            blurOnSubmit={true}
                        />
                    </View>
                </ScrollView>
                <Animated.View style={{
                            backgroundColor: CommonStyles.SEPARATOR_COLOR,
                            borderTopColor: CommonStyles.GLOBAL_BACKGROUND,
                            borderTopWidth: 1,
                            height: this.saveContainerAnimatedHeight,
                        }}
                        onLayout={this.onSaveContainerLayout}>
                    <CustomButton
                        title={'Save'}
                        onPress={this.onSaveItem}
                        showActivityIndicator={true}
                        style={[CommonStyles.styles.standardButton, {margin: CommonStyles.GLOBAL_PADDING}]}
                        deactivated={this.isDirty() == false}
                        register={this.saveSubscriber}
                    />
                </Animated.View>
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
    