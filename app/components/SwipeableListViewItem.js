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
 * - itemId = the identifier of the item to render
 * - rightAction = { caption, icon, callback } label, icon name and callback for right action
 * - leftAction = { caption, icon, callback } label, icon name and callback for left action
 * - renderItem = function to render the item inside the swipeable wrapper
 */
export default class SwipeableListViewItem extends React.Component {

    constructor(props) {
        super(props);
        this.swipeable = null;
        this.mounted = false;
        this.state = {
            leftActionActivated: false,
            rightActionActivated: false
        };
    }

    componentDidMount() {
        this.mounted = true;        
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.swipeable) {
            // FIXME : seting spropsCallback does not work and does not prevent
            //         the swipeable element calling the callbacks after it has been unmounted !!!
            //         -> we must use this.mounted flag to manage the callback and do not call setState() if not mounted...
            this.swipeable.props.onRightActionActivate = null;
            this.swipeable.props.onRightActionDeactivate = null;
            this.swipeable.props.onRightActionComplete = null;
            this.swipeable.props.onLeftActionActivate = null;
            this.swipeable.props.onLeftActionDeactivate = null;
            this.swipeable.props.onLeftActionComplete = null;
        }
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
            <View style={[
                    styles.swipeAction,
                    CommonStyles.styles.singleListItemContainer,
                    { backgroundColor: activated ? color : CommonStyles.DEACTIVATED_SWIPE_ACTION_COLOR, overflow: 'hidden' }
                ]}
            >
                {   
                    icon ?
                    <Ionicons name={icon} style={[CommonStyles.styles.swipeButtonIcon]} /> :
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

    onRightActionActivate() {
        if (this.mounted) {
            this.setState({rightActionActivated: true});
        }
    }
    onRightActionDeactivate() {
        if (this.mounted) {
            this.setState({rightActionActivated: false});
        }
    }
    onLeftActionActivate() {
        if (this.mounted) {
            this.setState({leftActionActivated: true});
        }
    }
    onLeftActionDeactivate() {
        if (this.mounted) {
            this.setState({leftActionActivated: false})
        }
    }

    render() {
        return (
            <Swipeable
                style={CommonStyles.styles.singleListItemContainer}
                onRef={ref => this.swipeable = ref}
                rightContent={this.props.rightAction ? this.getRightContent() : null }
                leftContent={this.props.leftAction ? this.getLeftContent() : null }

                rightActionActivationDistance={70}
                leftActionActivationDistance={70}

                onRightActionActivate={this.onRightActionActivate.bind(this)}
                onRightActionDeactivate={this.onRightActionDeactivate.bind(this)}
                onRightActionComplete={() => this.props.rightAction.callback(this.props.itemId)}

                onLeftActionActivate={this.onLeftActionActivate.bind(this)}
                onLeftActionDeactivate={this.onLeftActionDeactivate.bind(this)}
                onLeftActionComplete={() => this.props.leftAction.callback(this.props.itemId)}

                onSwipeStart={() => { if (this.props.onSwipeStart) this.props.onSwipeStart(); }} 
                onSwipeRelease={() => { if (this.props.onSwipeRelease) this.props.onSwipeRelease(); }}
            >
                <View style={{flex: 1, justifyContent: 'center'}}>
                    { this.props.children }
                </View>
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