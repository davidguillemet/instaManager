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
        this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
        this.onShowDuplicatesItemMenu = this.onShowDuplicatesItemMenu.bind(this);
        this.onShowOverflowItemMenu = this.onShowOverflowItemMenu.bind(this);
        this.navigateToCategory = this.navigateToCategory.bind(this);
        this.screenDidFocus = this.screenDidFocus.bind(this);
        this.processClosingBreakdown = this.processClosingBreakdown.bind(this);

        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            this.screenDidFocus
        );

        const closingDelay = 5;

        this.state = {
            closingDelay: closingDelay,
            closingInterval: 0.1,
            closingProgress: closingDelay,
            closing: false
        }
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

        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'View category'],
                cancelButtonIndex: 0,
                title: 'Quick Fix'
            },
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    // navigate to category
                    this.navigateToCategory(catId);        
                }
            }
        );
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

    renderEmptyComponent() {

        const remaining = this.state.closingProgress == this.state.closingDelay ? this.state.closingDelay : this.state.closingProgress + 1;

        return (
            <View>
                <Message success centered message={`All issues have been fixed.\nThis screen will close in ${Math.floor(remaining)} seconds.`} />
                <ProgressViewIOS
                    progressViewStyle='default'
                    progress={(this.state.closingDelay - this.state.closingProgress) / this.state.closingDelay}
                    trackTintColor={CommonStyles.TEXT_COLOR}
                    style={{width: '100%', height: CommonStyles.GLOBAL_PADDING}}/>
            </View>
        );
    }

    screenDidFocus(payload) {

        this.startClosingBreakdownIfNeeded();
    }

    componentDidUpdate() {

        this.startClosingBreakdownIfNeeded();
    }

    startClosingBreakdownIfNeeded() {
        
        if (this.props.sections.length == 0 && this.state.closing == false) {
            this.state.closing = true;
            setTimeout(this.processClosingBreakdown, this.state.closingInterval * 1000);
        }
    }

    processClosingBreakdown() {

        if (this.mounted == false) {
            return;
        }

        this.setState({
            closingProgress: this.state.closingProgress - this.state.closingInterval
        });
        
        if (this.state.closingProgress <= 0) {
            this.props.navigation.goBack(null);
            return;
        }

        setTimeout(this.processClosingBreakdown, this.state.closingInterval * 1000);
    }

    render() {

        const noMoreErrors = this.props.sections.length == 0;

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
                    ListEmptyComponent={this.renderEmptyComponent}
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
    