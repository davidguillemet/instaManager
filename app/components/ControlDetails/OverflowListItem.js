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
            <TouchableOpacity onPress={this.onShowOverflowItemMenu}>
                <View style={[
                    CommonStyles.styles.singleListItemContainer, 
                    { flex: 1, flexDirection: 'row', alignItems: 'center' }
                ]}
                >
                    <Text style={[CommonStyles.styles.singleListItem, { flex: 1 }]} numberOfLines={1}>{this.props.categoryName}</Text>
                    <Text style={CommonStyles.styles.singleListItem} numberOfLines={1}>{`${this.props.count} tags`}</Text>
                    <Ionicons style={{ color: CommonStyles.TEXT_COLOR, paddingRight: 5, marginLeft: CommonStyles.GLOBAL_PADDING }} name='ios-arrow-forward' size={CommonStyles.MEDIUM_FONT_SIZE} />
                </View>
            </TouchableOpacity>
            );
    }
}
