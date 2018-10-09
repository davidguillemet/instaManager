import React from 'react';
import {
    View,
    TextInput,
    StyleSheet
} from 'react-native';

import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonStyles from '../styles/common';
import CustomButton from './CustomButton';

/**
 * - placeholder (optional = 'search text' by default)
 * - dataSource = function to call to get the source data
 * - resultsCallback(results) = the function to call when the search process is completed
 * - filterProperty = name of the object property to use to compare with the search text
 */
export default class SearchInput extends React.PureComponent {

    static propTypes = {
        placeholder: PropTypes.string,                  // Placeholder for the input field
        dataSource: PropTypes.array.isRequired,         // an iterable object
        resultsCallback: PropTypes.func.isRequired,     // the method to call when the search completes
        filterProperty: PropTypes.string.isRequired,    // The name of property to use for the search process
        onValidateAdd: PropTypes.func,                  // A method to call to validate the input string when clicking on "Add"
        onAdd: PropTypes.func                           // Th emethod to call to add the object from the typed search string
    };

    constructor(props) {
        super(props);

        this.state = {
            tagToAdd: null
        };
        this.shouldSearch = this.shouldSearch.bind(this);
        this.onAdd = this.onAdd.bind(this);
    }

   shouldSearch(text) {
        // Trigger search process only if at least 2 characters
        if (text.length > 1) {
            let that = this;
            this.processSearch(text)
            .then((results) => {
                if (results.length == 0) {
                    this.setState({ tagToAdd: text});
                } else {
                    this.setState({ tagToAdd: null});
                }
                that.props.resultsCallback(results);
            });
        } else {
            this.setState({ tagToAdd: null});
            this.props.resultsCallback(null);
        }
    }

    processSearch(searchText) {

        let that = this;

        return new Promise(

            function(resolve, reject) {

                const dataList = that.props.dataSource;
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

    onAdd() {

        if (this.props.onValidateAdd == null || this.props.onValidateAdd(this.state.tagToAdd)) {

            this.props.onAdd(this.state.tagToAdd);
        }
    }

    renderAddButton() {

        if (this.state.tagToAdd == null || this.props.onAdd == null) {
            return null;
        }

        return (
            <CustomButton   title={'Add'}
                            onPress={this.onAdd}
                            style={[
                                CommonStyles.styles.standardButton,
                                CommonStyles.styles.smallLabel,
                                {
                                    marginBottom: 0,
                                    paddingVertical: 0,
                                    paddingHorizontal: CommonStyles.GLOBAL_PADDING
                                }]} />
        );
    }

    componentDidUpdate() {

        if (this.state.tagToAdd != null) {
            this.shouldSearch(this.state.tagToAdd);
        }
    }

    render() {
        return(
            <View style={styles.searchContainer}>
                <Ionicons name={'ios-search'} size={25} color={CommonStyles.TEXT_COLOR} style={{marginTop: 4}}/>
                <TextInput
                    onChangeText={this.shouldSearch}
                    autoCorrect={false}
                    style={styles.searchInput}                
                    selectionColor={CommonStyles.TEXT_COLOR}
                    placeholder={this.props.placeholder ? this.props.placeholder : 'search text'}
                    placeholderTextColor={CommonStyles.PLACEHOLDER_COLOR}
                    clearButtonMode={'always'}
                    autoCapitalize='none'
                    editable={this.props.dataSource != null && this.props.dataSource.length > 0}>
                </TextInput>
                { this.renderAddButton() }
            </View>
        );
    }
}

const styles = StyleSheet.create(
{
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
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
