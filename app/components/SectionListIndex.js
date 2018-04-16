import React, { PureComponent } from 'react';
import {
    StyleSheet,
    FlatList,
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
            <TouchableOpacity
                    onPressIn={() => this.onPressIndex(item.title, index)}
                    onPressOut={() => this.onPressIndex(null, null)}
                    delayPressOut={500}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.indexTitleStyle}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        
        if (this.props.sections == null || this.props.sections.length < 2) {
            return null;
        }

        return (
            <View style={styles.indexContainerStyle}>
                <FlatList
                    scrollEnabled={false}
                    data={this.props.sections}
                    keyExtractor={(item, index) => item.title}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    
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
        width: 20,
        right: 0,
        borderRadius: 3,
        backgroundColor: CommonStyles.KPI_COLOR,
        opacity: 0.5
    },
    indexTitleStyle: {
        color: CommonStyles.GLOBAL_FOREGROUND,
        fontWeight: "800",
        fontStyle: 'italic',
        fontSize: CommonStyles.SMALL_FONT_SIZE,
        height: CommonStyles.INDEX_ITEM_HEIGHT
    }
});
    