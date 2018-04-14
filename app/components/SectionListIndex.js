import React, { PureComponent } from 'react';
import {
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    View
 } from 'react-native';
import CommonStyles from '../styles/common';

export default class SectionListIndex extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    renderItem(item) {
        return (
            <TouchableOpacity onPress={() => this.props.onPressIndex(item.title)} >
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
                <View style={styles.indexStyle}>
                    <FlatList
                        scrollEnabled={false}
                        data={this.props.sections}
                        keyExtractor={(item, index) => item.title}
                        renderItem={({item}) => this.renderItem(item)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    indexContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        position: 'absolute',
        width: 20,
        top: 0,
        bottom: 0,
        right: 0,
    },
    indexStyle: {
        borderRadius: 3,
        backgroundColor: CommonStyles.KPI_COLOR,
        opacity: 0.5
    },
    indexTitleStyle: {
        color: CommonStyles.GLOBAL_FOREGROUND,
        fontWeight: "800",
        fontSize: CommonStyles.SMALL_FONT_SIZE
    }
});
    