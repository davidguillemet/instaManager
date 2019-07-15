import React from 'react';
import {
    ActivityIndicator,
    View,
    Text,
    TouchableOpacity
  } from 'react-native';
import { connect } from 'react-redux';
import { createUpdateTagAction } from '../../actions';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Utils from '../../managers/Utils';

function formatMediaCount(mediaCount) {
    if (mediaCount >= 0) {
        return Utils.formatBigNumber(mediaCount, 1);
    }
    return 'error';
}

class MediaCountItemUi extends React.PureComponent {
    constructor(props) {
        super(props);

        this.onRefresh = this.onRefresh.bind(this);

        this.state = {
            mediaCount: this.props.mediaCount,
            refreshing: false
        }
    }

    componentDidMount() {
        if (this.props.mediaCount == null) {
            this.setState({refreshing: true});
            this.triggerMediaCountUpdate();
        }
    }

    triggerMediaCountUpdate() {
        global.hashtagUtil.getMediaCount(this.props.tagName)
        .then(mediaCount => {
            if (this.props.tagId) {
                this.props.onMediaCountUpdated(this.props.tagId, mediaCount);
                this.setState({refreshing: false});
            } else {
                // update the tag instance itself and the component state
                this.updateMediaCountState(mediaCount);
            }
        })
        .catch(e => {
            if (this.props.tagId) {
                this.props.onMediaCountUpdated(this.props.tagId, -1);
                this.setState({refreshing: false});
            } else {
                // update the tag instance itself and the component state
                this.updateMediaCountState(-1);
            }
        });
    }

    updateMediaCountState(mediaCount) {
        this.props.tag.mediaCount = { count: mediaCount, timestamp: new Date() };
        this.setState({ refreshing: false, mediaCount: formatMediaCount(mediaCount) });
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.triggerMediaCountUpdate();
    }

    renderMediaCount() {

        if (this.state.refreshing == true) {
            return (
                <ActivityIndicator style={{marginRight: CommonStyles.GLOBAL_PADDING}} />
            );
        }

        const mediaCount = this.props.mediaCount || this.state.mediaCount;

        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {
                    mediaCount == 'error' ?
                    <Ionicons style={{color: CommonStyles.DARK_ORANGE, marginRight: CommonStyles.GLOBAL_PADDING }} name={'ios-warning'} size={24} /> :
                    <Text style={[CommonStyles.styles.singleListItem, CommonStyles.styles.smallLabel]} numberOfLines={1}>
                        {mediaCount}
                    </Text>
                }
                <TouchableOpacity onPress={this.onRefresh} >
                    <Ionicons style={{color: CommonStyles.TEXT_COLOR}} name={'ios-refresh'} size={24} />
                </TouchableOpacity>
            </View>
        );
    }

    render() {

        return (
            <View style={
                {
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent:'space-between',
                    paddingHorizontal: CommonStyles.GLOBAL_PADDING,
                    paddingVertical: 5
                }}>
                <Text style={[
                    CommonStyles.styles.singleListItem,
                    CommonStyles.styles.smallLabel,
                    {paddingHorizontal: 0, flex: 1}]}
                    numberOfLines={1}>
                    {this.props.tagName}
                </Text>
                { this.renderMediaCount() }
            </View>
        );
    }
}

function mustRefreshMediaCount(mediaCount) {

    if (mediaCount == null) {
        return true;
    }

    const refreshPeriod = global.settingsManager.getMediaCountRefreshPeriod();
    const refreshDate = Utils.getPivotDate(refreshPeriod);
    return mediaCount.timestamp <= refreshDate;
}

const mapStateToProps = (state, ownProps) => {

    // Get tag from redux store if identifier is specified
    let tag = 
        ownProps.tag.id ?
        global.hashtagUtil.getTagFromId(ownProps.tag.id) :
        ownProps.tag ;
    
    let tagId = null;
    if (tag == undefined) {
        // If the tag does not exist in the redux store,
        // we have a new tag which does not exist yet, like during import summary
        tag = ownProps.tag;
    } else {
        tagId = tag.id;
    }

    const mediaCount = mustRefreshMediaCount(tag.mediaCount) ? null : formatMediaCount(tag.mediaCount.count);

    return {
        tagId: tagId,
        tagName: tag.name,
        mediaCount: mediaCount
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onMediaCountUpdated: (tagId, mediaCount) => {
            const tag = global.hashtagUtil.getTagFromId(tagId);
            const tagUpdated = {
                id: tag.id,
                name: tag.name,
                categories: tag.categories,
                mediaCount: {
                    count: mediaCount,
                    timestamp: new Date()
                }
            };
            global.hashtagPersistenceManager.updateTagMediaCount(tagUpdated.id, tagUpdated.mediaCount);
            dispatch(createUpdateTagAction(tagUpdated));
        }
    }
}

const MediaCountItem = connect(mapStateToProps, mapDispatchToProps)(MediaCountItemUi);
export default MediaCountItem;
