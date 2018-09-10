import React, { PureComponent } from 'react';
import {
    StyleSheet,
    FlatList,
    PanResponder,
    Text,
    TouchableOpacity,
    View
 } from 'react-native';
import CommonStyles from '../styles/common';

import FocusedListIndex from './FocusedListIndex';

export default class SectionListIndex extends React.PureComponent {

    constructor(props) {
        super(props);
        this.focusedIndexRef = null;
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                if (this.positionIsOnIndexList(evt.nativeEvent.locationX, evt.nativeEvent.locationY)) {
                    this.onPanResponderLocation(evt.nativeEvent.locationY);
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                if (this.positionIsOnIndexList(evt.nativeEvent.locationX, evt.nativeEvent.locationY)) {
                    this.onPanResponderLocation(evt.nativeEvent.locationY);
                } else {
                    this.clearFocusedIndex();
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                if (this.positionIsOnIndexList(evt.nativeEvent.locationX, evt.nativeEvent.locationY))
                {
                    const indexTitle = this.getIndexTitleFromPositionY(evt.nativeEvent.locationY);
                    this.props.onPressIndex(indexTitle);
                }
                this.clearFocusedIndex();
            }
        });
    }

    clearFocusedIndex() {
        this.focusedIndexRef.onIndexChanged(null, null);
    }

    positionIsOnIndexList(positionX, positionY) {
        // Check the position to check if the gesture was released outside of the index list:
        // - if position x is negative or > INDEX_LIST_WIDTH, 
        // - if the position Y is negative or > INDEX_ITEM_HEIGHT*this.props.sections.length
        return (
            positionX >= 0 &&
            positionX < CommonStyles.INDEX_LIST_WIDTH &&
            positionY >= 0 &&
            positionY < CommonStyles.INDEX_ITEM_HEIGHT*this.props.sections.length
        );
    }

    getIndexTitleFromPositionY(positionY) {
        const itemIndex = Math.floor(positionY / CommonStyles.INDEX_ITEM_HEIGHT);
        const indexTitle = this.props.sections[itemIndex].title;
        return indexTitle;
    }

    onPanResponderLocation(positionY) {
        const indexTitle = this.getIndexTitleFromPositionY(positionY);
        this.focusedIndexRef.onIndexChanged(indexTitle, positionY);
    }

    onPressIndex(indexTitle, index) {
        if (indexTitle) {
            this.props.onPressIndex(indexTitle);
            if (this.focusedIndexRef) {
                const positionY = index * CommonStyles.INDEX_ITEM_HEIGHT + CommonStyles.INDEX_ITEM_HEIGHT / 2;
                this.focusedIndexRef.onIndexChanged(indexTitle, positionY);
            }
        } else {
            if (this.focusedIndexRef) {
                this.focusedIndexRef.onIndexChanged(null, null);
            }            
        }
    }

    renderItem(item, index) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} pointerEvents='none'>
                <Text style={styles.indexTitleStyle}>{item.title}</Text>
            </View>
        );
    }

    render() {
        
        if (this.props.sections == null || this.props.sections.length < 2) {
            return null;
        }

        return (
            <View style={styles.indexContainerStyle} {...this.panResponder.panHandlers}>
                <FlatList
                    scrollEnabled={false}
                    data={this.props.sections}
                    keyExtractor={(item, index) => item.title}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    pointerEvents='none'
                />
                <FocusedListIndex ref={ref => this.focusedIndexRef = ref}/>
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    indexContainerStyle: {
        justifyContent: 'center',
        position: 'absolute',
        width: CommonStyles.INDEX_LIST_WIDTH,
        right: 0,
        borderRadius: 3,
        backgroundColor: CommonStyles.KPI_COLOR,
        opacity: 0.5
    },
    indexTitleStyle: {
        color: CommonStyles.GLOBAL_FOREGROUND,
        fontWeight: "800",
        fontSize: CommonStyles.SMALL_FONT_SIZE,
        height: CommonStyles.INDEX_ITEM_HEIGHT
    }
});
    