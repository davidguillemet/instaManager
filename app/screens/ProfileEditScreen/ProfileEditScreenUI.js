import React from 'react';
import {
    Alert,
    Animated,
    Keyboard,
    ScrollView,
    View
} from 'react-native';

import Form from '../../components/Form';
import CommonStyles from '../../styles/common';
import CustomButton from '../../components/CustomButton';

export default class ProfileEditScreenUi extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dirty: false,
            profileName: this.props.profileName,
            profileDesc: this.props.profileDesc,
            setAsActiveProfile: false
        };

        if (this.props.editorMode == global.CREATE_MODE || this.props.profileId == this.props.activeProfileId) {
            this.state.setAsActiveProfile = true;
        }

        this.onChangeProfileName = this.onChangeProfileName.bind(this);
        this.onChangeProfileDesc = this.onChangeProfileDesc.bind(this);
        this.onChangeSetAsActiveProfile = this.onChangeSetAsActiveProfile.bind(this);
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
            description: profileDesc,
        };

        let setAsActiveProfile = false;
        if (this.props.editorMode == global.CREATE_MODE || this.props.profileId != this.props.activeProfileId) {
            setAsActiveProfile = this.state.setAsActiveProfile;
        }
        this.props.onSaveProfile(profileToSave, this.props.editorMode === global.UPDATE_MODE, setAsActiveProfile);
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
                for (let item of profilesWithSameName) {
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

    onChangeSetAsActiveProfile(value) {
        this.setState({
            setAsActiveProfile: value
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
                    <Form parameters={[
                        {
                            name: 'Profile Name',
                            type: 'text',
                            mandatory: true,
                            value: this.state.profileName,
                            focus: true,
                            placeholder: `Enter a Profile name`,
                            onChange: this.onChangeProfileName
                        },
                        {
                            name: 'Profile Description',
                            type: 'text',
                            value: this.state.profileDesc,
                            placeholder: `Enter a Profile description`,
                            onChange: this.onChangeProfileDesc
                        },
                        {
                            name: 'Set as active profile',
                            type: 'boolean',
                            value: this.state.setAsActiveProfile,
                            onChange: this.onChangeSetAsActiveProfile,
                            disabled: this.props.profileId == this.props.activeProfileId
                        }
                    ]}/>
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

    