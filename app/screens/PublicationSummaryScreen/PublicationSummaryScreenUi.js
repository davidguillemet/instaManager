import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Clipboard
} from 'react-native';

import CategorieTagsDisplay from '../../components/CategorieTagsDisplay';
import CustomButton from '../../components/CustomButton';
import CommonStyles from '../../styles/common';
import { NotificationType, BottomNotification } from '../../components/BottomNotification';

export default class PublicationSummaryScreenUi extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Publication Summary'
        }   
    };

    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;

        this.id = null;
        this.name = params.name;
        this.category = params.category;
        this.ownTags = params.tags;

        // Flatten tags and keep a trace of the tags which are specific from this publication (outside category)
        if (this.category) {
            const ancestors = global.hashtagUtil.getAncestorCategories(this.category);
            const tagSet = ancestors.reduce((set, cat) => { 
                cat.hashtags.forEach(tagId => set.add(tagId));
                return set;
            }, new Set(this.ownTags));
            this.tags = [...tagSet];
        } else {
            this.tags = [...this.ownTags];
        }
   
        this.onDeleteTag = this.onDeleteTag.bind(this);
        this.onTagSelectionValidated = this.onTagSelectionValidated.bind(this);
        this.onCopyToClipboard = this.onCopyToClipboard.bind(this);
        this.onSavePublication = this.onSavePublication.bind(this);

        this.state = {
            copyCompleted: false, // true as soon as the tags have been exported to clipboard
            saveCompleted: false  // true as soon as the publication has been saved
        }

        this.copyClipboardSubscriber = [];
        this.saveSubscriber = [];
    }

    onDeleteTag(deletedTagId) {

        this.tags = this.tags.filter(tagId => tagId != deletedTagId);
    }

    onTagSelectionValidated(selection) {

        this.tags = [...selection];
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
                    tagsValue += '#' + global.hashtagUtil.getTagFromId(tag).name;
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

        // properties: {
        //     id: 'string',
        //     name: 'string?',
        //     description: 'string?',
        //     creationDate: 'date',
        //     tagNames: 'string[]', // contain the name of each tag (category + additional)
        //     category: 'TagCategory?', // base category; optional since it could have been removed
        //     categoryName: 'string',  // name of the referenced category (could have been removed)
        //     archived: {type: 'bool',  default: false}
        // }

        this.setState( {
            saveCompleted: false,
        });
    
        const update = this.id !== null;
        if (this.id === null) {
            this.id = global.uniqueID();
        }

        const newPublication = {
            id: this.id,
            name: this.name,
            description: null, // not yet supported
            creationDate: new Date(),
            tagNames: this.tags.map(tagId => global.hashtagUtil.getTagFromId(tagId).name),
            category: this.category,
            categoryName: global.hashtagUtil.getCatFromId(this.category).name,
            archived: false
        }
        
        global.hashtagPersistenceManager.savePublication(newPublication, update).then(() => {
            this.props.onSavePublication(newPublication);
            this.setState( {
                saveCompleted: true,
            });
            this.saveSubscriber.forEach(listener => listener.setActionCompleted());
        });
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

                { /* TODO: Update Publication => Update Publication as soon as it has been saved or Edit mode */ }
                <CustomButton
                    style={[CommonStyles.styles.standardButton, {justifyContent: 'center', marginHorizontal: CommonStyles.GLOBAL_PADDING}]}
                    title={'Save the publication'}
                    onPress={this.onSavePublication}
                    register={this.saveSubscriber}
                    showActivityIndicator={true}
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
                            defaultValue={this.category ? global.hashtagUtil.getCatFromId(this.category).name  : 'category removed'}
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
                { 
                    this.state.saveCompleted ?
                    <BottomNotification
                        caption={'The publication has been saved.'}
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
