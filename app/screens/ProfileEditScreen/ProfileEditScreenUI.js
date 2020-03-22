import React from 'react';
import {
    Alert,
    Keyboard,
    ScrollView,
    View
} from 'react-native';

import Form from '../../components/Form';
import CommonStyles from '../../styles/common';

export default class ProfileEditScreenUi extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            profileId: this.props.profileId || global.uniqueID(),
            profileName: this.props.profileName,
            profileDesc: this.props.profileDesc,
            setAsActiveProfile: false
        };

        if (this.props.editorMode == global.CREATE_MODE || this.state.profileId == this.props.activeProfileId) {
            this.state.setAsActiveProfile = true;
        }

        this.onChangeProfileName = this.onChangeProfileName.bind(this);
        this.onChangeProfileDesc = this.onChangeProfileDesc.bind(this);
        this.onChangeSetAsActiveProfile = this.onChangeSetAsActiveProfile.bind(this);
        this.getProfileName = this.getProfileName.bind(this);
        this.notifySaveComponent = this.notifySaveComponent.bind(this);

        // Required functions for HOC withSaveButton
        this.canSaveItem = this.canSaveItem.bind(this);
        this.onSaveItem = this.onSaveItem.bind(this);
        this.setSaveComponent = this.setSaveComponent.bind(this);
    }

    getProfileName() {
        return this.state.profileName.trim();
    }

    getHeaderTitle() {
        return 'Edit Profile';
    }
    
    getItemId() {
        return this.state.profileId;
    }

    setSaveComponent(saveComponent) {
        this.saveComponent = saveComponent;
    }

    onSaveItem() {

        // canSaveItem shall be called in HOC component withSaveButton
        // - we call it here just to be sure...
        if (this.canSaveItem() == false) {
            return;
        }

        const profileName = this.getProfileName();
        const profileDesc = this.state.profileDesc.trim();

        const profileToSave = {
            id: this.state.profileId,
            name: profileName,
            description: profileDesc,
        };

        let setAsActiveProfile = false;
        if (this.props.editorMode == global.CREATE_MODE || this.state.profileId != this.props.activeProfileId) {
            setAsActiveProfile = this.state.setAsActiveProfile;
        }
        this.props.onSaveProfile(profileToSave, this.props.editorMode === global.UPDATE_MODE, setAsActiveProfile);
    }
    
    canSaveItem() {

        const profileName = this.getProfileName();

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
                    if (item.id !== this.state.profileId) {
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

    notifySaveComponent() {
        this.saveComponent.setState({dirty: this.getProfileName().length > 0});
    }

    onChangeProfileName(text) {
                
        this.setState({
            profileName: text
        }, this.notifySaveComponent);
    }

    onChangeProfileDesc(text) {
                
        this.setState({
            profileDesc: text
        }, this.notifySaveComponent);
    }

    onChangeSetAsActiveProfile(value) {
        this.setState({
            setAsActiveProfile: value
        });
    }
    
    render() {

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
                            disabled: this.state.profileId == this.props.activeProfileId
                        }
                    ]}/>
                </ScrollView>
            </View>
        );
    }
}

    