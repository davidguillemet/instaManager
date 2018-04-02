import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import Swipeable from 'react-native-swipeable';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CommonStyles from '../styles/common';

/**
 * expected properties:
 * - item = the item to render
 * - rightAction = { caption, icon, callback } label, icon name and callback for right action
 * - leftAction = { caption, icon, callback } label, icon name and callback for left action
 * - renderItem = function to render the item inside the swipeable wrapper
 */
export default class SwipeableListViewItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            leftActionActivated: false,
            rightActionActivated: false
        };
    }

    getRightContent() {
        const {rightActionActivated} = this.state;
        const {caption, icon, color} = this.props.rightAction;
        return this.getSwipeContent(rightActionActivated, caption, icon, color);
    }

    getLeftContent() {
        const {leftActionActivated} = this.state;
        const {caption, icon, color } = this.props.leftAction;
        return this.getSwipeContent(leftActionActivated, caption, icon, color);
    }

    getSwipeContent(activated, caption, icon, color) {
        return (
            <View style={[styles.swipeAction, { backgroundColor: activated ? color : CommonStyles.DEACTIVATED_SWIPE_ACTION_COLOR }] }>
                {   
                    icon ?
                    <Ionicons name={icon} style={CommonStyles.styles.swipeButtonIcon} /> :
                    null
                }
                { 
                    activated && caption ?
                    <Text style={CommonStyles.styles.smallLabel}>{caption}</Text> :
                    null
                }
            </View>
        );
    }

    render() {
        return (
            <Swipeable
                rightContent={this.props.rightAction ? this.getRightContent() : null }
                leftContent={this.props.leftAction ? this.getLeftContent() : null }

                rightActionActivationDistance={70}
                leftActionActivationDistance={70}

                onRightActionActivate={() => this.setState({rightActionActivated: true})}
                onRightActionDeactivate={() => this.setState({rightActionActivated: false})}
                onRightActionComplete={() => this.props.rightAction.callback(this.props.item)}

                onLeftActionActivate={() => this.setState({leftActionActivated: true})}
                onLeftActionDeactivate={() => this.setState({leftActionActivated: false})}
                onLeftActionComplete={() => this.props.leftAction.callback(this.props.item)}
            >
                { this.props.renderItem(this.props.item) }
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create(
{
    swipeAction: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});