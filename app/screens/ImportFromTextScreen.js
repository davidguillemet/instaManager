import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert
} from 'react-native';

import CommonStyles from '../styles/common';
import CustomButton from '../components/CustomButton';

export default class ImportFromTextScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Import',
        }   
    };

    constructor(props) {
        super(props);

        this.state = {
            empty: true
        };

        this.tagsImportedSubscriber = [];

        this.onAddImportTags = this.onAddImportTags.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onNext = this.onNext.bind(this);
    }

    onNext(importedTags) {

        const params = importedTags; // { tags: [...], errors: [...] }

        this.props.navigation.navigate('ImportFromTextResult', params);
    }

    onAddImportTags() {
        
        const that = this;

        const promise = new Promise(
            function(resolve, reject) {
                
                const tags = global.hashtagUtil.getTagsFromText(that.state.text);
                resolve(tags);
            }
        );

        promise.then((importedTags) => {
            this.tagsImportedSubscriber.forEach(listener => listener.setActionCompleted());
            if (importedTags.errors.length > 0 && importedTags.tags.length == 0) {
                // All tags are invalid
                Alert.alert('Warning', 'No vadid tags have been found.\n' + global.hashtagUtil.getTagNameRule());
            } else {
                this.onNext(importedTags);
            }
        });
    }

    onChangeText(text) {

        const empty = text == null || text.length == 0;
        this.setState( { text: text, empty: empty });
    }

    render() {

        return (
            <View style={CommonStyles.styles.standardPage}>
                <View style={CommonStyles.styles.standardTile}>
                    <Text style={CommonStyles.styles.mediumLabel}>You can import your hastags by clicking on "Import tags" once you have entered a string containing a space-separated list of tags, which might start with '#' or not.</Text>
                </View>
                <CustomButton
                    style={CommonStyles.styles.standardButtonCentered}
                    title={'Import Tags'}
                    onPress={this.onAddImportTags}
                    deactivated={this.state.empty}
                    showActivityIndicator={true}
                    register={this.tagsImportedSubscriber}
                />
                <TextInput
                    style={styles.textInputStyle}
                    onChangeText={this.onChangeText}
                    multiline={true}
                    placeholder={'Enter your space-separated tag list here'}
                    placeholderTextColor={CommonStyles.PLACEHOLDER_COLOR}
                    autoCapitalize='none'
                />
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    textInputStyle: {
        flex: 1,
        borderColor: CommonStyles.SEPARATOR_COLOR,
        borderWidth: 1,
        borderRadius: CommonStyles.BORDER_RADIUS,
        color: CommonStyles.TEXT_COLOR,
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        padding: CommonStyles.GLOBAL_PADDING
    }
});
    