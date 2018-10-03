import React from 'react';
import {
    ActionSheetIOS,
    Alert,
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView
} from 'react-native';

import TagContainer from '../../components/TagContainer';
import CustomButton from '../../components/CustomButton';
import CommonStyles from '../../styles/common';
import { NotificationType, BottomNotification } from '../../components/BottomNotification';
import Wizard from '../../components/Wizard';
import CategoryList from '../../components/categorylist';
import CategorieTagsDisplay from '../../components/CategorieTagsDisplay';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class PublicationWizardScreenUi extends React.PureComponent {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Publication Wizard'
        }   
    };

    constructor(props) {
        super(props);

        this.state = {
            wizardStep: 0,
            selectedCategory: [],
            tags: [],
            additionalTags: [],
            name: null,
            description: null,
            copyCompleted: false
        }
                
        this.onPreviousStep = this.onPreviousStep.bind(this);
        this.onNextStep = this.onNextStep.bind(this);
        this.onCategorySelectionChanged = this.onCategorySelectionChanged.bind(this);

        this.onDeleteTag = this.onDeleteTag.bind(this);
        this.onTagSelectionValidated = this.onTagSelectionValidated.bind(this);
        this.onCopyToClipboard = this.onCopyToClipboard.bind(this);
        this.onShowActiveWizardStepMenu = this.onShowActiveWizardStepMenu.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onSavePublication = this.onSavePublication.bind(this);

        this.wizardConfig = {
            complete: {
                action: this.onSavePublication,
                caption: 'Save'
            },
            steps: [
                {
                    caption: 'Select a Category',
                    description: 'You can select a category to initialize the new publication',
                    key: 'selectCat',
                    renderStep: this.renderCategorySelection.bind(this),
                    validate: this.validateCategorySelection.bind(this)
                },
                {
                    caption: 'Customize the publication',
                    description: 'You can customize the publication by selecting any additional tag',
                    key: 'custom',
                    renderStep: this.renderCustomizePublication.bind(this),
                    validate: this.validateTags.bind(this),
                    menuItems: [
                        {
                            caption: 'Copy to clipboard',
                            icon: 'ios-share',
                            action: this.onCopyToClipboard
                        }
                    ]
                },
                {
                    caption: 'Save the publication',
                    description: 'Optionally, You can save the publication by entering a name and a description if needed',
                    key: 'save',
                    renderStep: this.renderSavePublication.bind(this),
                    validate: this.validatePublicationProperties.bind(this),
                    menuItems: [
                        {
                            caption: 'Copy to clipboard',
                            icon: 'ios-share',
                            action: this.onCopyToClipboard
                        }
                    ]
                }
            ]
        };
    }

    onSavePublication() {

        if (!this.validatePublicationProperties()) {
            return;
        }

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
    
        const categoryId = this.state.selectedCategory && this.state.selectedCategory.length > 0 ? this.state.selectedCategory[0] : null;

        const newPublication = {
            id: global.uniqueID(),
            name: this.state.name,
            description: this.description,
            creationDate: new Date(),
            tagNames: this.state.tags.map(tagId => global.hashtagUtil.getTagFromId(tagId).name),
            category: categoryId,
            categoryName: categoryId ? global.hashtagUtil.getCatFromId(categoryId).name : null,
            archived: false
        }
        
        global.hashtagPersistenceManager.savePublication(newPublication, false).then(() => {
            this.props.onSavePublication(newPublication);
            this.props.navigation.goBack();
        });
    }

    onShowActiveWizardStepMenu() {

        const stepMenuItems = this.getActiveWizardStep().menuItems;
        if (!stepMenuItems) {
            return;
        }

        const options = stepMenuItems.map(item => item.caption);
        const actions = stepMenuItems.map(item => item.action);

        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', ...options],
                cancelButtonIndex: 0,
                title: 'Actions'
            },
            (buttonIndex) => {
                if (buttonIndex > 0) {
                    actions[buttonIndex - 1]();
                }
            }
        );
    }

    renderWizardStepMenu() {

        const menuItems = this.getActiveWizardStep().menuItems;
        if (menuItems) {
            if (menuItems.length == 1) {
                const menuItem = menuItems[0];
                return (
                    <CustomButton onPress={menuItem.action} style={[CommonStyles.styles.standardButton, styles.wizardStepButton]} title={menuItem.caption}>
                        {
                            menuItem.icon ?
                            <Ionicons name={menuItem.icon} style={CommonStyles.styles.navigationButtonIcon} size={CommonStyles.LARGE_FONT_SIZE} /> :
                            null
                        }
                    </CustomButton>
                );
            }
            else {
                return (
                    <CustomButton onPress={this.onShowActiveWizardStepMenu} style={[CommonStyles.styles.standardButton, styles.wizardStepButton]}>
                        <Ionicons name={'ios-more'} style={CommonStyles.styles.navigationButtonIcon} size={CommonStyles.LARGE_FONT_SIZE} />
                    </CustomButton>
                );
            }
        }

        return null;
    }

    onCopyToClipboard() {

        if (!this.validateTags()) {
            return;
        }

        this.setState( {
            copyCompleted: false,
        });
        
        global.hashtagUtil.getTagObjectsFromTagIdentifiers(this.state.tags)
        .then((tagObjects) => {
            return global.hashtagUtil.copyToClipboard(tagObjects);
        })
        .then(() => {
            this.setState( {
                copyCompleted: true,
            });
        });
    }

    changeWizardStep(step) {
        this.setState({
            wizardStep: step
        });
    }

    onPreviousStep() {
        
        if (this.state.wizardStep > 0) {
            this.changeWizardStep(this.state.wizardStep - 1);
        }
    }

    onNextStep() {

        if (!this.getActiveWizardStep().validate()) {
            return;
        }

        if (this.state.wizardStep < this.wizardConfig.steps.length - 1) {
            this.changeWizardStep(this.state.wizardStep + 1);
        } else {
            this.wizardConfig.complete.action();
        }
    }

    onCategorySelectionChanged(selectedCategories) {

        this.state.tags = null;

        if (selectedCategories != null && selectedCategories.length > 0) {

            const selectedCategory = selectedCategories[0];
            this.state.selectedCategory = [selectedCategory.id];
        } else {
            this.state.selectedCategory = [];
        }
    }

    getActiveWizardStep() {

        return this.wizardConfig.steps[this.state.wizardStep];
    }

    renderCategorySelection() {
        return (
            <CategoryList
                mode={global.LIST_SELECTION_MODE}
                selectionMode={global.SINGLE_SELECTION}
                onSelectionChanged={this.onCategorySelectionChanged}
                selection={ this.state.selectedCategory }
            />
        );
    }
    validateCategorySelection() {

        return true;
    }

    onDeleteTag(deletedTagId) {

        this.state.tags = this.state.tags.filter(tagId => tagId != deletedTagId);
    }

    onTagSelectionValidated(selection) {

        this.state.tags = selection;
    }

    validateTags() {

        if (this.state.tags && this.state.tags.length > 0) {
            return true;
        }

        Alert.alert('Error', 'The publication is empty. Please, Select at least one tag.',
        [
            {
                text: 'OK',
                type: 'cancel'
            }
        ]);

        return false;
    }

    renderCustomizePublication() {

        if (this.state.tags == null) {

            const selectedCategoryId = this.state.selectedCategory && this.state.selectedCategory.length > 0 ? this.state.selectedCategory[0] : null;

            const ancestors = selectedCategoryId ? global.hashtagUtil.getAncestorCategories(selectedCategoryId) : [];
            const tagSet = ancestors.reduce((set, cat) => { 
                cat.hashtags.forEach(tagId => set.add(tagId));
                return set;
            }, new Set());
            this.state.tags = [...tagSet];    
        }

        return (
            <CategorieTagsDisplay
                tags={this.state.tags}
                onDeleteTag={this.onDeleteTag}
                onTagSelectionValidated={this.onTagSelectionValidated}
                itemType={global.PUBLICATION_ITEM}
            />
        );
    }

    onChangeName(text) {
        this.state.name = text;
    }

    renderSavePublication() {
        return (
            <View style={styles.parameterContainerView}>
                <Text style={CommonStyles.styles.smallLabel}>Name</Text>
                <View style={{ width: 20 }}/>
                <TextInput
                    defaultValue={this.state.name }
                    autoFocus={true}
                    keyboardType='default'
                    autoCapitalize='none'
                    style={styles.parameterInput}
                    placeholder={`Enter a publication name`}
                    selectionColor={CommonStyles.TEXT_COLOR}
                    placeholderTextColor={CommonStyles.PLACEHOLDER_COLOR}
                    clearButtonMode={'always'}
                    onChangeText={this.onChangeName}
                />
            </View>
        );
    }

    validatePublicationProperties() {
        
        if (this.state.name && this.state.name.length > 0) {
            return true;
        }

        Alert.alert('Error', 'Please, Enter a publication name.',
        [
            {
                text: 'OK',
                type: 'cancel'
            }
        ]);

        return false;
    }

    render() {
        return(
            <View style={[CommonStyles.styles.standardPage, { padding: 0, justifyContent: 'space-between'}]}>
                
                <View style={{padding: CommonStyles.GLOBAL_PADDING}}>
                    <Wizard steps={this.wizardConfig.steps} activeStep={this.state.wizardStep} />
                </View>

                <ScrollView style={CommonStyles.styles.standardPage}>

                    <View>
                        { this.getActiveWizardStep().renderStep() }
                        <View style={{height: 100}}></View>
                    </View>

                </ScrollView>

                <View style={{
                        position: 'absolute',
                        padding: CommonStyles.GLOBAL_PADDING,
                        bottom: CommonStyles.GLOBAL_PADDING,
                        right: CommonStyles.GLOBAL_PADDING,
                        left: CommonStyles.GLOBAL_PADDING,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
                        backgroundColor: CommonStyles.COLOR_TRANSPARENT
                    }}>
                    <View style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                            backgroundColor: 'black',
                            opacity: 0.15,
                            borderRadius: CommonStyles.BORDER_RADIUS,
                            borderWidth: 1,
                            borderColor: CommonStyles.COLOR_TRANSPARENT
                            }}>
                    </View>
                    <CustomButton
                        onPress={this.onPreviousStep}
                        style={[CommonStyles.styles.standardButton, styles.wizardStepButton]}
                        deactivated={this.state.wizardStep == 0}>
                        <Ionicons name={'ios-arrow-back'} style={CommonStyles.styles.navigationButtonIcon}/>
                    </CustomButton>

                    { this.renderWizardStepMenu() }

                    <CustomButton
                        onPress={this.onNextStep}
                        style={[CommonStyles.styles.standardButton, styles.wizardStepButton]}
                        title={this.wizardConfig.complete.caption}>
                        {
                            this.state.wizardStep < this.wizardConfig.steps.length - 1 ?
                            <Ionicons name={'ios-arrow-forward'} style={CommonStyles.styles.navigationButtonIcon}/> :
                            null
                        }
                    </CustomButton>
                </View>
                
                { 
                    this.state.copyCompleted ?
                    <BottomNotification
                        caption={'The tags have been exported to the clipboard.'}
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
        paddingLeft: CommonStyles.GLOBAL_PADDING
    },
    parameterInput: {
        flex: 1,
        textAlign: 'right',
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        color: CommonStyles.KPI_COLOR,
        padding: CommonStyles.GLOBAL_PADDING
    },
    wizardStepButton: {
        marginBottom: 0
    } 
});