import React from 'react';
import {
    SectionList,
    ActionSheetIOS,
    ProgressViewIOS,
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DuplicatedListItem from './DuplicatesListItem';
import OverflowListItem from './OverflowListItem';
import ListItemSeparator from '../ListItemSeparator';

export default class ControlDetailsUi extends React.PureComponent {

    constructor(props) {
        super(props);

        this.renderListItem = this.renderListItem.bind(this);
        this.renderDuplicatesListItem = this.renderDuplicatesListItem.bind(this);
        this.renderOverflowListItem = this.renderOverflowListItem.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.onShowDuplicatesItemMenu = this.onShowDuplicatesItemMenu.bind(this);
        this.onShowOverflowItemMenu = this.onShowOverflowItemMenu.bind(this);
        this.navigateToCategory = this.navigateToCategory.bind(this);
        this.screenDidFocus = this.screenDidFocus.bind(this);

        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            this.screenDidFocus
        );


    }

    componentDidMount() {

        this.mounted = true;        
    }

    componentWillUnmount() {

        this.didFocusSubscription.remove();
        this.mounted = false;
    }

    navigateToCategory(catId) {

        const category = global.hashtagUtil.getCatFromId(catId);
        
        const params = {
            updateItem: category,
            itemType: global.CATEGORY_ITEM
        };

        this.props.navigation.navigate('HashtagCategoryEdit', params);        
    }

    onShowOverflowItemMenu(catId) {

        // no menu, just navigate to category
        this.navigateToCategory(catId);        
    }

    onShowDuplicatesItemMenu(catId, tagId) {

        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', `Remove tag from category`, `View category`],
                cancelButtonIndex: 0,
                title: 'Quick Fix'
            },
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    // Remove tag from category
                    this.props.onRemoveDuplicate(catId, tagId);
                } else if (buttonIndex === 2) {
                    // navigate to category
                    this.navigateToCategory(catId);        
                }
            }
        );
    }
    
    screenDidFocus(payload) {

        this.startClosingBreakdownIfNeeded();
    }

    componentDidUpdate() {

        this.startClosingBreakdownIfNeeded();
    }

    startClosingBreakdownIfNeeded() {
        
        if (this.props.sections.length == 0) {
            this.props.navigation.goBack(null);
        }
    }

    renderSectionHeader({section}) {
        return (
            <View style={{ borderLeftColor: CommonStyles.GLOBAL_FOREGROUND, borderLeftWidth: 4 }}>
                <Text style={[CommonStyles.styles.mediumLabel, styles.sectionHeader]}>{section.title}</Text>
            </View>
        );
    }

    renderDuplicatesListItem(item) {

        /**
         * props:
         * - category: catId,
         * - tag: tag identifier
         */
        const category = global.hashtagUtil.getCatFromId(item.category);
        const tag = global.hashtagUtil.getTagFromId(item.tag);

        return (
            <DuplicatedListItem 
                categoryId={category.id}
                categoryName={category.name}
                tagId={tag.id}
                tagName={tag.name}
                onShowMenu={this.onShowDuplicatesItemMenu}
            />
        );
    }

    renderOverflowListItem(item) {

        /**
         * props:
         * - category: catId,
         */
        const category = global.hashtagUtil.getCatFromId(item.category);

        return (
            <OverflowListItem
                categoryId={category.id}
                categoryName={category.name}
                count={item.count}
                onShowMenu={this.onShowOverflowItemMenu}
            />
        );
    }

    renderListItem({item}) {
        if (item.type == 'duplicates') {
            return this.renderDuplicatesListItem(item);
        } else {
            return this.renderOverflowListItem(item);
        }
    }

    render() {

        return (
            <View style={{flex: 1}}>
                {
                    this.props.sections.length > 0 ?
                    <Message error centered message={'Some issues haves been detected which you can fix by removing duplicated tags and/or editing categories.'} /> :
                    null
                }
                <SectionList
                    style={{ flex: 1 }}
                    sections={this.props.sections} 
                    renderItem={this.renderListItem}
                    renderSectionHeader={this.renderSectionHeader}
                    ItemSeparatorComponent={ListItemSeparator}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sectionHeader: {
        paddingHorizontal: CommonStyles.GLOBAL_PADDING,
        paddingVertical: CommonStyles.GLOBAL_PADDING,
        backgroundColor: '#192b48',
        fontWeight: 'bold',
    }
});
    
