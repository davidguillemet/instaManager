import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import { connect } from 'react-redux';

import SwipeableListViewItem from '../../components/SwipeableListViewItem';
import Flag from '../../components/Flag';
import CommonStyles from '../../styles/common'; 


class PublicationListItemUi extends React.PureComponent {

    static propTypes = {
        id: PropTypes.string.isRequired,            // item identifier
        name: PropTypes.string.isRequired,          // item name
        categoryName: PropTypes.string.isRequired,  // Category Name
        tagsCount: PropTypes.number.isRequired,     // number of tags
        time: PropTypes.string.isRequired,          // publication time
        setParentState: PropTypes.func.isRequired,  // callback to change parent state
        onDeleteItem: PropTypes.func.isRequired,    // callback when an item is deleted
        onPress: PropTypes.func.isRequired          // callback when an item is pressed
    };

    constructor(props) {
        super(props);

        this._onDeleteTag = this._onDeleteTag.bind(this);
        this._onCopyTag = this._onCopyTag.bind(this);
        this._onPress = this._onPress.bind(this);
    }

    _onPress() {

        this.props.onPress(this.props.id);
    }

    _onDeleteTag(itemId) {
        
        const pubToDelete = global.hashtagUtil.getPubFromId(itemId);
        const pubName = pubToDelete.name || 'no name';
        
        Alert.alert('', `Are you sure you want to delete the publication '${pubName}'?`,[
            { 
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    this.props.onDeleteItem(this.props.id);
                }
            }
        ]);
    }

    _onCopyTag(itemId) {

        this.props.onCopyPublication(itemId);
    }

    render() {

        const numberOfTags = `${this.props.tagsCount} / ${this.props.maxTagsCount}`;
        const error = this.props.tagsCount > this.props.maxTagsCount;
        const publicationTime = `${this.props.time}`;
        const publicationCategory = this.props.categoryName.length > 0 ? `based on '${this.props.categoryName}'` : 'No category.';
        const flagStyle = {
            color: error ? CommonStyles.DARK_RED : CommonStyles.DARK_GREEN,
            backgroundColor: error ? CommonStyles.LIGHT_RED : CommonStyles.LIGHT_GREEN
        }

        return (
            <SwipeableListViewItem
                itemId={this.props.id} 
                height={70}
                rightAction={{ caption: 'Delete', icon: 'ios-trash', color: CommonStyles.DELETE_COLOR, callback: this._onDeleteTag }}
                leftAction={{ caption: 'Copy', icon: 'ios-copy', color: CommonStyles.DARK_GREEN, callback: this._onCopyTag }}
                onSwipeStart={() => this.props.setParentState({isSwiping: true})}
                onSwipeRelease={() => this.props.setParentState({isSwiping: false})}
            >
                <TouchableOpacity onPress={this._onPress}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', paddingRight: CommonStyles.GLOBAL_PADDING }}>
                        <View style={{flexDirection: 'column', flex: 1, paddingVertical: 5}}>
                            <Text style={[CommonStyles.styles.singleListItem]} numberOfLines={1}>{this.props.name}</Text>
                            <Text style={[
                                CommonStyles.styles.singleListItem,
                                CommonStyles.styles.smallLabel,
                                {
                                    fontStyle: 'italic',
                                    color: CommonStyles.DEACTIVATED_TEXT_COLOR
                                }]}
                                numberOfLines={1}>
                                {publicationTime}
                            </Text>
                            <Text style={[
                                CommonStyles.styles.singleListItem,
                                CommonStyles.styles.smallLabel,
                                {
                                    fontStyle: 'italic',
                                    color: CommonStyles.DEACTIVATED_TEXT_COLOR
                                }]}
                                numberOfLines={1}>
                                {publicationCategory}
                            </Text>
                        </View>
                        <Flag caption={numberOfTags} style={flagStyle}/>
                    </View>
                </TouchableOpacity>
            </SwipeableListViewItem>
        );
    }
}


const mapStateToProps = (state, props) => {

    return {
        maxTagsCount: global.settingsManager.getMaxNumberOfTags(),
    };
}

const PublicationListItem = connect(mapStateToProps)(PublicationListItemUi);

export default PublicationListItem;
