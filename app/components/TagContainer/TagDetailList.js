import React from 'react';
import {
    FlatList,
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import ListItemSeparator from '../ListItemSeparator';
import MediaCountItem from './MediaCountItem';
import SwipeableListViewItem from '../SwipeableListViewItem';

const SORT_ORDER = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending'
};

export default class TagDetailList extends React.PureComponent {
    
    constructor(props) {
        super(props);
        this.state = {
            sortedColumn: 0,
            sortOrder: [ SORT_ORDER.ASCENDING, SORT_ORDER.ASCENDING ],
            isSwiping: false
        }
        this.renderMediaCountItem = this.renderMediaCountItem.bind(this);
        this.renderListHeader = this.renderListHeader.bind(this);
        this.getSortIndicator = this.getSortIndicator.bind(this);
        this.toggleSortFirstColumn = this.toggleSortFirstColumn.bind(this);
        this.toggleSortSecondColumn = this.toggleSortSecondColumn.bind(this);
        this.toggleSortForColumn = this.toggleSortForColumn.bind(this);
        this.sortTags = this.sortTags.bind(this);
        this.toggleSwipping = this.toggleSwipping.bind(this);
    }

    mediaCountKeyExtractor(item, index) {
        return item.id;
    }

    toggleSwipping() {
        this.setState({isSwiping: !this.state.isSwiping});
    }

    renderMediaCountItem({item}) {
        return (
            <SwipeableListViewItem
                itemId={item.id}
                height={40}
                rightAction={{ caption: 'Delete', icon: 'ios-trash', color: CommonStyles.DELETE_COLOR, callback: this.props.onDelete }}
                onSwipeStart={this.toggleSwipping}
                onSwipeRelease={this.toggleSwipping}
            >
                <MediaCountItem tag={item} />
            </SwipeableListViewItem>
        );
    }

    toggleSortFirstColumn() {
        this.toggleSortForColumn(0);
    }

    toggleSortSecondColumn() {
        this.toggleSortForColumn(1);
    }

    sortTags() {
        
        const sortOrder = this.state.sortOrder[this.state.sortedColumn];        
        this.props.tags.sort((tag1, tag2) => {
            const t1 = sortOrder == SORT_ORDER.ASCENDING ? tag1 : tag2;
            const t2 = sortOrder == SORT_ORDER.ASCENDING ? tag2 : tag1;
            switch (this.state.sortedColumn) {
                case 0: // Sort on tag name
                    return t1.name.localeCompare(t2.name);
                case 1: // sort on tag media count
                    if (t1.mediaCount == null && t2.mediaCount == null) return 0;
                    if (t1.mediaCount == null) return -1;
                    if (t2.mediaCount == null) return 1;
                    return t1.mediaCount.count - t2.mediaCount.count;
            }
        }); 
    }

    toggleSortForColumn(column) {
        const newSortOrderArray = [ ...this.state.sortOrder ];

        if (this.state.sortedColumn == column) {
            // just toggle sort order for current column
            const newSortOrder = this.state.sortOrder[column] == SORT_ORDER.ASCENDING ? SORT_ORDER.DESCENDING : SORT_ORDER.ASCENDING;
            newSortOrderArray[column] = newSortOrder;
        }

        this.setState({
            sortedColumn: column,
            sortOrder: newSortOrderArray
        });
    }

    getSortIndicator(column, disabled) {

        if (this.state.sortedColumn != column) {
            return null;
        }

        // The indicator style is an array
        const indicatorStyle = [
            this.state.sortOrder[column] == SORT_ORDER.ASCENDING ?
            styles.ascendingIndicator :
            styles.descendingIndicator
        ];

        if (this.state.sortOrder[column] == SORT_ORDER.ASCENDING) {
            indicatorStyle.push(disabled ? styles.ascendingIndicatorOff : styles.ascendingIndicatorOn);
        } else {
            indicatorStyle.push(disabled ? styles.descendingIndicatorOff : styles.descendingIndicatorOn);
        }

        return (
            <View style={indicatorStyle} />
        );
    }

    renderListHeader() {
        
        const sortDisabled = this.props.tags.length <= 1;

        const headerStyle = {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: CommonStyles.GLOBAL_PADDING,
            backgroundColor: CommonStyles.BUTTON_COLOR,
            borderRadius: CommonStyles.BORDER_RADIUS
        };

        const headerTextStyle = {
            fontWeight: 'bold',
            marginRight: CommonStyles.GLOBAL_PADDING,
            color: sortDisabled ? CommonStyles.DEACTIVATED_TEXT_COLOR : CommonStyles.TEXT_COLOR
        }

        const mediaCountHeaderTextStyle = {
            ...headerTextStyle
        }

        // We cannot sort on media count if at least one item is refreshing
        const sortOnMediaCountDisabled = (this.props.tags.findIndex(t => t.mediaCount == null) >= 0);
        if (sortOnMediaCountDisabled) {
            mediaCountHeaderTextStyle.color = CommonStyles.DEACTIVATED_TEXT_COLOR;
        }

        return (
            <View style={{flexDirection: 'row', flex: 1, paddingHorizontal: CommonStyles.GLOBAL_PADDING }}>
                <TouchableOpacity
                    onPress={this.toggleSortFirstColumn}
                    disabled={sortDisabled}
                    style={headerStyle}>
                    <Text style={[CommonStyles.styles.smallLabel, headerTextStyle]}>Tag name</Text>
                    { this.getSortIndicator(0, sortDisabled) }
                </TouchableOpacity>
                <View style={{marginHorizontal: CommonStyles.GLOBAL_PADDING}}></View>
                <TouchableOpacity
                    disabled={sortOnMediaCountDisabled || sortDisabled}
                    onPress={this.toggleSortSecondColumn}
                    style={headerStyle}>
                    <Text style={[CommonStyles.styles.smallLabel, mediaCountHeaderTextStyle]}>Media count</Text>
                    { this.getSortIndicator(1, sortOnMediaCountDisabled || sortDisabled) }
                </TouchableOpacity>
            </View>
        );
    }

    renderEmptyComponent() {
        return (
            <View style={{flex: 1, alignItems: 'center', padding: CommonStyles.GLOBAL_PADDING}}>
                <Text style={CommonStyles.styles.mediumLabel}>This category is empty</Text>
            </View>
        );
    }

    render() {

        this.sortTags();

        return (
            <FlatList
                data={this.props.tags}
                extraData={this.state}
                keyExtractor={this.mediaCountKeyExtractor}
                renderItem={this.renderMediaCountItem}
                ItemSeparatorComponent={ListItemSeparator}
                ListHeaderComponent={this.renderListHeader}
                ListEmptyComponent={this.renderEmptyComponent}
                scrollEnabled={!this.state.isSwiping}
            />
        );
    }
}

const styles = StyleSheet.create({
   
    ascendingIndicator: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 16,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent'
    },
    ascendingIndicatorOn: {
        borderBottomColor: CommonStyles.SELECTED_TEXT_COLOR
    },
    ascendingIndicatorOff: {
        borderBottomColor: CommonStyles.DEACTIVATED_TEXT_COLOR
    },


    descendingIndicator: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 16,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: CommonStyles.SELECTED_TEXT_COLOR
    },
    descendingIndicatorOn: {
        borderBottomColor: CommonStyles.SELECTED_TEXT_COLOR
    },
    descendingIndicatorOff: {
        borderBottomColor: CommonStyles.DEACTIVATED_TEXT_COLOR
    },

});
  
