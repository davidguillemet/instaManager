import React, { PureComponent } from 'react';
import {
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    View
 } from 'react-native';
import CommonStyles from '../styles/common';

export default class FocusedListIndex extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = { currentIndex: null, top: 0};
    }

    onIndexChanged(indexTitle, positionY) {
        this.setState( { currentIndex: indexTitle, top: positionY - CommonStyles.FOCUSED_ITEM_SIZE / 2 });
    }

    render() {
        if (this.state.currentIndex == null) {
            return null;
        }
        return (
            <View style={[styles.focusedIndexContainerStyle, { top: this.state.top }]}>
                <Text style={styles.focusedIndexStyle}>{this.state.currentIndex}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    focusedIndexContainerStyle: {
        position: 'absolute',
        width: CommonStyles.FOCUSED_ITEM_SIZE,
        height: CommonStyles.FOCUSED_ITEM_SIZE,
        left: -70,
        backgroundColor: CommonStyles.GLOBAL_FOREGROUND,
        borderRadius: CommonStyles.BORDER_RADIUS,
        justifyContent: 'center',
        alignItems: 'center'
    },
    focusedIndexStyle: {
        color: CommonStyles.TEXT_COLOR,
        fontWeight: "800",
        fontSize: CommonStyles.BIG_FONT_SIZE,
    }
});
