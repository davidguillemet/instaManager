import React from 'react';
import {
    View,
    TextInput,
    StyleSheet
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import CommonStyles from '../styles/common';

export default class SearchInput extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.searchContainer}>
                <Ionicons name={'ios-search'} size={25} color={CommonStyles.TEXT_COLOR} style={{marginTop: 4}}/>
                <TextInput
                    {...this.props}
                    autoCorrect={false}
                    style={styles.searchInput}                
                    selectionColor={CommonStyles.TEXT_COLOR}
                    clearButtonMode={'always'}>
                </TextInput>
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: CommonStyles.SEARCH_INPUT_BORDER_RADIUS,
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: CommonStyles.GLOBAL_FOREGROUND
    },
    searchInput: {
        flex: 1,
        fontSize: CommonStyles.MEDIUM_FONT_SIZE,
        color: CommonStyles.TEXT_COLOR,
        marginLeft: 10
    }
});
