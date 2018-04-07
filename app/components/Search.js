import React from 'react';
import {
    View,
    TextInput,
    StyleSheet
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import CommonStyles from '../styles/common';

/**
 * - placeholder (optional = 'search text' by default)
 * - dataSource = function to call to get the source data
 * - resultsCallback(results) = the function to call when the search process is completed
 * - filterProperty = name of the object property to use to compare with the search text
 */
export default class SearchInput extends React.PureComponent {

    constructor(props) {
        super(props);
    }

   shouldSearch(text) {
        // Trigger search process only if at least 2 characters
        if (text.length > 1) {
            let that = this;
            this.processSearch(text)
            .then((results) => {
                that.props.resultsCallback(results);
            });
        } else {
            this.props.resultsCallback(null);
        }
    }

    processSearch(searchText) {

        let that = this;

        return new Promise(

            function(resolve, reject) {

                const dataList = that.props.dataSource();
                let results = [];
                const upperCaseSearch = searchText.toUpperCase();
                for (let data of dataList) {
                    
                    let dataValue = data[that.props.filterProperty];
                    if (dataValue.toUpperCase().includes(upperCaseSearch)) {
                        results.push(data);
                    }
                }
                resolve(results);
            }
        );
    }

    render() {
        return(
            <View style={styles.searchContainer}>
                <Ionicons name={'ios-search'} size={25} color={CommonStyles.TEXT_COLOR} style={{marginTop: 4}}/>
                <TextInput
                    onChangeText={this.shouldSearch.bind(this)}
                    autoCorrect={false}
                    style={styles.searchInput}                
                    selectionColor={CommonStyles.TEXT_COLOR}
                    placeholder={this.props.placeholder ? this.props.placeholder : 'search text'}
                    placeholderTextColor={CommonStyles.PLACEHOLDER_COLOR}
                    clearButtonMode={'always'}
                    autoCapitalize='none'>
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
