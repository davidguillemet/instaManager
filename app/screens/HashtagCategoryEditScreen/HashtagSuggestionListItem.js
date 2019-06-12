import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import CommonStyles from '../../styles/common'; 

export default class HashtagSuggestionListItem extends React.PureComponent {

    static propTypes = {
        name: PropTypes.string.isRequired,          // Suggestion name
        mediaCount: PropTypes.string.isRequired,    // Media count
        selected: PropTypes.bool,                   // initial selection state
        onSelect: PropTypes.func.isRequired         // callback when a suggestion item is pressed
    };

    static defaultProps = {
        selected: false,        // by default, an item is not selected
    };

    constructor(props) {
        super(props);

        this._onSelect = this._onSelect.bind(this);
    }

    _onSelect() {

        this.props.onSelect(this.props.name);
    }

    render() {
        return (
            <TouchableOpacity onPress={this._onSelect} style={{flexDirection: 'row', alignItems: 'center', padding: 5}} disabled={this.props.selected}>
                <Ionicons style={{
                    color: this.props.selected ? CommonStyles.MEDIUM_GREEN : CommonStyles.GLOBAL_BACKGROUND,
                    marginRight: 10
                    }} name={'ios-arrow-forward'} size={CommonStyles.BIG_FONT_SIZE} 
                />
                <View style={{flexDirection: 'column'}}>
                    <Text style={[CommonStyles.styles.mediumLabel, {
                            color: this.props.selected ? CommonStyles.SELECTED_TEXT_COLOR : CommonStyles.TEXT_COLOR,
                            fontWeight: this.props.selected ? 'bold' : 'normal'
                        }]} numberOfLines={1}>{this.props.name}</Text>
                    <Text style={[CommonStyles.styles.smallLabel, {
                            fontStyle: 'italic',
                            color: this.props.selected ? CommonStyles.SELECTED_TEXT_COLOR : CommonStyles.DEACTIVATED_TEXT_COLOR
                        }]} numberOfLines={1}>
                        {this.props.mediaCount}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}
