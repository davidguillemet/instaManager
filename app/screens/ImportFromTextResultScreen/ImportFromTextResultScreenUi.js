import React from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    View,
    Text
} from 'react-native';

import CommonStyles from '../../styles/common';
import CustomButton from '../../components/CustomButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import TagContainer from '../../components/TagContainer';
import ListItemSeparator from '../../components/ListItemSeparator';
import Message from '../../components/Message';
import Ionicons from 'react-native-vector-icons/Ionicons';

const INVALID_TAGS = 'invalid';
const DUPLICATE_TAGS = 'duplicated';
const REJECTED_TAGS = 'rejected';
const SELECTED_TAGS = 'selected';

export default class ImportFromTextScreen extends React.PureComponent {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Import',
        }   
    };

    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        this.initialTags = params.tags;
        this.initialErrors = params.errors;

        this.state = {
            loading: true,
            selected: SELECTED_TAGS
        }

        this.onAddImportedTags = this.onAddImportedTags.bind(this);
        this.renderImportedTags = this.renderImportedTags.bind(this);
        this.onRejectTag = this.onRejectTag.bind(this);
        this.onAddRejectedTag = this.onAddRejectedTag.bind(this);

        this.renderTagSummaryMenuItem = this.renderTagSummaryMenuItem.bind(this);
        this.getItemTypeCaption = this.getItemTypeCaption.bind(this);
        this.getItemsFromType = this.getItemsFromType.bind(this);
        this.switchSelectedItem = this.switchSelectedItem.bind(this);

        this.importSubscribers = [];
    }

    getTagObject(tagName) {

        return {
            id: global.uniqueID(),
            name: tagName,
            categories: []
        }
    }

    componentDidMount() {

        const that = this;

        const promise = new Promise(
            function(resolve, reject) {
                // Create tag objects from import result
                const tagObjects = [];
                const duplicateObjects = [];
                that.initialTags.forEach(tagName => {
                    const tagObject = that.getTagObject(tagName);
                    const itemsWithSameName = global.hashtagUtil.searchItem(global.TAG_ITEM, tagName);
                    if (itemsWithSameName.length > 0) {
                        duplicateObjects.push(tagObject);
                    } else {
                        tagObjects.push(tagObject);
                    }

                });
                
                const errorObjects = that.initialErrors.map((tagName) => that.getTagObject(tagName));
       
                const allTagsObjects = {
                    tags: tagObjects,
                    errors: errorObjects,
                    duplicates: duplicateObjects,
                    rejected: []
                }

                resolve(allTagsObjects);
            }        
        );

        promise.then((allTags) => {

            const selected =
                allTags.tags && allTags.tags.length > 0 ? SELECTED_TAGS :
                allTags.duplicates && allTags.duplicates.length > 0 ? DUPLICATE_TAGS :
                INVALID_TAGS; // Should not happen since it would mean we only have invalid tags...

            that.setState({
                loading: false,
                tags: allTags.tags,
                duplicates: allTags.duplicates,
                errors: allTags.errors,
                rejected: allTags.rejected,
                selected: selected
            });
        });
    }


    onAddImportedTags() {

        this.props.onAddTags(this.state.tags);
        this.importSubscribers.forEach(listener => listener.setActionCompleted());
        this.props.navigation.navigate('HomeAfterImport', { importNotification: true });
    }

    onRejectTag(tagId) {

        // transfer from tags to rejected
        const tagIndex = this.state.tags.findIndex(tag => tag.id == tagId);
        const tagToReject = this.state.tags[tagIndex];
        const newTags = [...this.state.tags];
        newTags.splice(tagIndex, 1);

        let selected = this.state.selected;
        if (newTags.length == 0) {
            // No more selected tags = selected item is "rejected tags"
            selected = REJECTED_TAGS;
        }

        const newRejected = [...this.state.rejected];
        newRejected.push(tagToReject);

        this.setState({
            tags: newTags,
            rejected: newRejected,
            selected: selected
        });
    }

    onAddRejectedTag(tagId) {

        const tagIndex = this.state.rejected.findIndex(tag => tag.id == tagId);
        const tagToAdd = this.state.rejected[tagIndex];
        const newRejectedTags = [...this.state.rejected];
        newRejectedTags.splice(tagIndex, 1);

        let selected = this.state.selected;
        if (newRejectedTags.length == 0) {
            // No more rejected tags = selected item is "selected tags"
            selected = SELECTED_TAGS;
        }

        const newTags = [...this.state.tags];
        newTags.push(tagToAdd);

        this.setState({
            tags: newTags,
            rejected: newRejectedTags,
            selected: selected
        });
    }

    renderTags(tags, readOnly, onPress, iconName) {

        return (
            <TagContainer style={{ marginTop: 10 }}
                tags={tags}
                asObject={true}
                itemType={global.TAG_ITEM}
                onPressTag={onPress}
                readOnly={readOnly}
                addSharp={true}
                iconName={iconName}
            />
        );
    }

    renderImportedTags() {

        const tagsToDisplay = this.getItemsFromType(this.state.selected);
        const readOnly = this.state.selected == INVALID_TAGS || this.state.selected == DUPLICATE_TAGS;
        const tipCaption =
            tagsToDisplay.length == 0 ? null :
            this.state.selected == INVALID_TAGS ? 'The following tags are invalid and are ignored.\n' + global.hashtagUtil.getTagNameRule() :
            this.state.selected == DUPLICATE_TAGS ? 'Duplicated tags already exist in the repository and are ignored.' :
            this.state.selected == REJECTED_TAGS ? 'The following rejected tags won\'t be imported.\nYou can select any tag again by clicking it.' :
            'Click on \’Save Tags\' to import the selected tags in your repository.\nYou can reject any tag by clicking it.';
        const iconName =
            this.state.selected == SELECTED_TAGS ? 'ios-close-circle-outline' :
            this.state.selected == REJECTED_TAGS ? 'ios-add-circle-outline' :
            null;

        const onPressTag =
            this.state.selected == SELECTED_TAGS ? this.onRejectTag :
            this.state.selected == REJECTED_TAGS ? this.onAddRejectedTag : 
            null;

        return (
            <ScrollView style={CommonStyles.styles.standardPage}>
                <CustomButton
                    style={CommonStyles.styles.standardButtonCentered}
                    title={'Save Tags'}
                    onPress={this.onAddImportedTags}
                    deactivated={this.state.tags.length == 0}
                    showActivityIndicator={true}
                    register={this.importSubscribers}
                />
                {
                    this.state.tags.length == 0 ?
                    <Message message={'There is no valid tag to save'} centered error /> :
                    null
                }
                <FlatList style={{ borderWidth: 0, borderColor: CommonStyles.SEPARATOR_COLOR }}
                    data={[
                        { key: INVALID_TAGS },
                        { key: DUPLICATE_TAGS },
                        { key: REJECTED_TAGS },
                        { key: SELECTED_TAGS }
                    ]}
                    renderItem={this.renderTagSummaryMenuItem}
                    ItemSeparatorComponent={ListItemSeparator}
                />
                {
                    tipCaption ?
                    <View style={[CommonStyles.styles.standardTile, { marginTop: CommonStyles.GLOBAL_PADDING*2 }]}>
                        <Text style={[CommonStyles.styles.smallLabel]}>{tipCaption}</Text>
                    </View> :
                    null
                }
                { this.renderTags(tagsToDisplay, readOnly, onPressTag, iconName) }
            </ScrollView>
        );
    }

    getItemTypeCaption(itemType) {

        switch (itemType) {

            case INVALID_TAGS:
                return `Invalid tags (${this.state.errors.length})`;
            case DUPLICATE_TAGS:
                return `Duplicated tags (${this.state.duplicates.length})`;
            case REJECTED_TAGS:
                return `Rejected tags (${this.state.rejected.length})`;
            case SELECTED_TAGS:
                return `Selected Tags (${this.state.tags.length})`;
            default:
                return 'unknown type';
        }
    }

    getItemsFromType(itemType) {

        switch (itemType) {

            case INVALID_TAGS:
                return this.state.errors;
            case DUPLICATE_TAGS:
                return this.state.duplicates;
            case REJECTED_TAGS:
                return this.state.rejected;
            case SELECTED_TAGS:
                return this.state.tags;
            default:
                return [];
        }
    }

    switchSelectedItem(targetType) {
        
        this.setState({
            selected: targetType
        });

    }

    renderTagSummaryMenuItem({item}) {

        const disabled = item.key == this.state.selected || this.getItemsFromType(item.key).length == 0;
        const selected = item.key == this.state.selected;

        let textStyle = StyleSheet.flatten(styles.singleItem);
        let containerViewStyle = { flex: 1, flexDirection: 'row', alignItems: 'center' };

        if (selected) {
            textStyle = { fontWeight: 'bold', ...textStyle };
        }

        if (disabled && !selected) {
            textStyle = { color: CommonStyles.DEACTIVATED_TEXT_COLOR, ...textStyle };
        }

        return (
            <TouchableOpacity onPress={() => this.switchSelectedItem(item.key)} disabled={disabled}>
                <View style={containerViewStyle}>
                    <Ionicons style={{color: selected ? CommonStyles.MEDIUM_GREEN : CommonStyles.GLOBAL_BACKGROUND}} name={'ios-arrow-forward'} size={CommonStyles.BIG_FONT_SIZE} />
                    <Text style={[CommonStyles.styles.mediumLabel, textStyle]}>{this.getItemTypeCaption(item.key)}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {

        return (
            <View style={[CommonStyles.styles.standardPage, { padding: 0 }]}>
                {
                    this.state.loading ?
                    <LoadingIndicator /> :
                    this.renderImportedTags()
                }
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    singleItem:  {
        flex: 1,
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        paddingVertical: 10
    }, 
    warningCaption: {
        flex: 1,
        marginTop: CommonStyles.GLOBAL_PADDING, 
        backgroundColor: CommonStyles.LIGHT_RED,
        borderRadius: CommonStyles.BORDER_RADIUS,
        borderWidth: 1,
    },
    warningText: {
        color: CommonStyles.DARK_RED,
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        marginVertical: 3
    }
});
    