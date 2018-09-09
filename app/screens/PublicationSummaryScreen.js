import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Clipboard
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import CategorieTagsDisplay from '../components/CategorieTagsDisplay';
import CustomButton from '../components/CustomButton';
import CommonStyles from '../styles/common';
import { NotificationType, BottomNotification } from '../components/BottomNotification';
import ActivityIndicatorLoadingView from '../components/LoadingIndicator';

export default class PublicationSummaryScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Publication Summary'
        }   
    };

    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;

        this.name = params.name;
        this.category = params.category;
        this.ownTags = params.tags;
        this.tags = this.ownTags;

        // Flatten tags and keepo a trace of the tags which are specific from this publication (outside category)
        if (this.category) {
            const ancestors = global.hashtagUtil.getAncestorCategories(this.category);
            ancestors.forEach(cat => {
                this.tags = this.tags.concat(cat.hashtags);
            });
        }
   
        this.onDeleteTag = this.onDeleteTag.bind(this);
        this.onTagSelectionValidated = this.onTagSelectionValidated.bind(this);
        this.onCopyToClipboard = this.onCopyToClipboard.bind(this);
        this.onSavePublication = this.onSavePublication.bind(this);

        this.state = {
            copyCompleted: false // true as soon as the tags have been exported to clipboard
        }

        this.copyClipboardSubscriber = [];
    }

    onDeleteTag(tagId) {

        // TODO
    }

    onTagSelectionValidated(selection) {

        // TODO
    }

    onCopyToClipboard() {

        this.setState( {
            copyCompleted: false,
        });
        
        const that = this;

        const promise = new Promise(
            function(resolve, reject) {

                let tagsValue = '';

                that.tags.forEach((tag) => {
        
                    if (tagsValue.length > 0) {
                        tagsValue += ' ';
                    }
                    tagsValue += '#' + tag.name;
                });
        
                let tagStream = global.settingsManager.getHeader()
                tagStream += tagsValue;
                tagStream += global.settingsManager.getFooter();
                Clipboard.setString(tagStream);
                
                resolve();
            }
        );

        promise.then(() => {
            this.setState( {
                copyCompleted: true,
            });
            this.copyClipboardSubscriber.forEach(listener => listener.setActionCompleted());
        });
    }

    onSavePublication() {

        // TODO
    }

    render() {
        return(
            <View style={[CommonStyles.styles.standardPage, { padding: 0 }]}>
                
                <CustomButton
                    style={[CommonStyles.styles.standardButton, {justifyContent: 'center', marginTop: CommonStyles.GLOBAL_PADDING, marginHorizontal: CommonStyles.GLOBAL_PADDING}]}
                    title={'Copy to clipboard'}
                    onPress={this.onCopyToClipboard}
                    register={this.copyClipboardSubscriber}
                    showActivityIndicator={true}
                />

                <CustomButton
                    style={[CommonStyles.styles.standardButton, {justifyContent: 'center', marginHorizontal: CommonStyles.GLOBAL_PADDING}]}
                    title={'Save the publication'}
                    onPress={this.onSavePublication}
                />

                <ScrollView style={CommonStyles.styles.standardPage}>

                    <View style={styles.parameterContainerView}>
                        <Text style={CommonStyles.styles.smallLabel}>Name</Text>
                        <View style={{ width: 20 }}/>
                        <TextInput
                            defaultValue={this.name || '<no name>'}
                            style={styles.parameterInput}
                            selectionColor={CommonStyles.TEXT_COLOR}
                            editable={false}
                        />
                    </View>
                    <View style={styles.parameterContainerView}>
                        <Text style={CommonStyles.styles.smallLabel}>Base category</Text>
                        <View style={{ width: 20 }}/>
                        <TextInput
                            defaultValue={this.category ? global.hashtagUtil.getCatFromId(this.category).name  : '<no category>'}
                            style={styles.parameterInput}
                            selectionColor={CommonStyles.TEXT_COLOR}
                            editable={false}
                        />
                    </View>
                    <View style={{height: 20}}></View>
                    <CategorieTagsDisplay
                        tags={this.tags}
                        onDeleteTag={this.onDeleteTag}
                        onTagSelectionValidated={this.onTagSelectionValidated}
                        itemType={global.PUBLICATION_ITEM}
                        showSegmentControl={false}
                    />

                    <View style={{ height: 20 }}></View>

                </ScrollView>
                
                { 
                    this.state.copyCompleted ?
                    <BottomNotification
                        caption={'The tags have been sent to the clipboard.'}
                        type={NotificationType.SUCCESS}
                        manuallyCloseable={true}
                    />
                    :
                    null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    parameterContainerView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: CommonStyles.SEPARATOR_COLOR,
        borderBottomWidth: 1,
        paddingTop: CommonStyles.GLOBAL_PADDING,
        paddingLeft: CommonStyles.GLOBAL_PADDING
    },
    parameterInput: {
        flex: 1,
        textAlign: 'right',
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        color: CommonStyles.KPI_COLOR,
        padding: CommonStyles.GLOBAL_PADDING
    }
});
