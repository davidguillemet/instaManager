import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tag from './../Tag';

export default class DuplicatedListItem extends React.PureComponent {

    static propTypes = {
        categoryId: PropTypes.string.isRequired,
        categoryName: PropTypes.string.isRequired,
        tagId: PropTypes.string.isRequired,
        tagName: PropTypes.string.isRequired,
        onShowMenu: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.onShowDuplicatesItemMenu = this.onShowDuplicatesItemMenu.bind(this);
    }

    onShowDuplicatesItemMenu() {

        this.props.onShowMenu(this.props.categoryId, this.props.tagId);
    }

    render() {
        
        const caption = `in ${this.props.categoryName}`;

        return (
            <View style={[
                    CommonStyles.styles.singleListItemContainer, 
                    { flex: 1, flexDirection: 'row', alignItems: 'center', height: 60 }
                ]}
            >
                <Tag name={'#' + this.props.tagName} style={{ marginLeft: 10 }} />
                <Text style={[CommonStyles.styles.singleListItem, { flex: 1 }]} numberOfLines={1}>{caption}</Text>
                <TouchableOpacity onPress={this.onShowDuplicatesItemMenu}>
                    <Ionicons style={{ color: CommonStyles.TEXT_COLOR, paddingRight: CommonStyles.GLOBAL_PADDING }} name='ios-more' size={CommonStyles.LARGE_FONT_SIZE} />
                </TouchableOpacity>
            </View>
        );
    }
}
