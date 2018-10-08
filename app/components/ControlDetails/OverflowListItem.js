import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default class OverflowListItem extends React.PureComponent {

    static propTypes = {
        categoryId: PropTypes.string.isRequired,
        categoryName: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        onShowMenu: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.onShowOverflowItemMenu = this.onShowOverflowItemMenu.bind(this);
    }

    onShowOverflowItemMenu() {

        this.props.onShowMenu(this.props.categoryId);
    }

    render() {
        
        return (
            <View style={[
                CommonStyles.styles.singleListItemContainer, 
                { flex: 1, flexDirection: 'row', alignItems: 'center' }
            ]}
            >
                <Text style={[CommonStyles.styles.singleListItem, { flex: 1 }]} numberOfLines={1}>{this.props.categoryName}</Text>
                <Text style={CommonStyles.styles.singleListItem} numberOfLines={1}>{`${this.props.count} tags`}</Text>
                <TouchableOpacity onPress={this.onShowOverflowItemMenu}>
                    <Ionicons style={{ color: CommonStyles.ARCHIVE_COLOR, paddingRight: CommonStyles.GLOBAL_PADDING }} name='ios-eye' size={CommonStyles.LARGE_FONT_SIZE} />
                </TouchableOpacity>
            </View>
        );
    }
}
