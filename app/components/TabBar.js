import React from 'react';
import {
    Animated,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import PropTypes from 'prop-types';
import CommonStyles from '../styles/common';
import Ionicons from 'react-native-vector-icons/Ionicons';

class TabBarItem extends React.PureComponent {

    static propTypes = {
        index: PropTypes.number.isRequired,
        selected: PropTypes.bool.isRequired,
        onSelectTabItem: PropTypes.func.isRequired,
        caption: PropTypes.string,
        icon: PropTypes.string,
        active: PropTypes.bool,
        animationDuration: PropTypes.number.isRequired
    };

    static defaultProps = {
        active: true,
        caption: null,
        icon: null
    };

    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(this.props.selected ? 1 : 0.5)
        }
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect() {
        this.props.onSelectTabItem(this.props.index);
    }

    componentDidUpdate(prevProps) {
        const { selected } = this.props;

        if (prevProps.selected != selected) {
            Animated.timing(
                this.state.opacity,
                {
                    toValue: selected ? 1 : 0.5,
                    duration: this.props.animationDuration
                }
            ).start();
        }
    }

    render() {

        const colorStyle = {
            color: this.props.active == false ? CommonStyles.DEACTIVATED_TEXT_COLOR : CommonStyles.SELECTED_TEXT_COLOR
        };
        const opacityStyle = {
            opacity: this.state.opacity
        };
        const mergedStyle = {
            ...colorStyle,
            ...opacityStyle
        };

        return(
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.onSelect}
                disabled={this.props.selected}
                style={styles.tabBarItemStyle}>
                {
                    this.props.caption != null ? <Animated.Text styles={mergedStyle}>{this.props.caption}</Animated.Text> :
                    this.props.icon != null    ? <Animated.View style={opacityStyle}><Ionicons style={colorStyle} name={this.props.icon} size={25} /></Animated.View> :
                    <Animated.Text style={mergedStyle}>{'???'}</Animated.Text>
                }
            </TouchableOpacity>
        );
    }
}

class TabBarIndicator extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            left: null
        }
    }

    componentDidUpdate(prevProps) {
        const { itemsCount, selectedIndex, layout} = this.props;

        if (prevProps.selectedIndex != selectedIndex && layout.width !== 0) {
            Animated.timing(
                this.state.left,
                {
                    toValue: (layout.width / itemsCount) * selectedIndex,
                    duration: this.props.animationDuration
                }
            ).start();
        }
    }

    render() {

        const { itemsCount, selectedIndex, layout } = this.props;

        if (layout.width != 0 && this.state.left == null) {
            this.state.left = new Animated.Value((layout.width / itemsCount) * selectedIndex); 
        }

        return (
            <Animated.View style={[
                styles.tabBarIndicator,
                { width: `${100 / itemsCount}%` },
                layout.width ?
                    { left: this.state.left } :
                    { left: `${(100 / itemsCount) * selectedIndex}%` }
            ]} />
        );
    }
}

export default class TabBar extends React.PureComponent {

    static propTypes = {
        tabBarItems: PropTypes.array.isRequired,
        selectedIndex: PropTypes.number
    };

    static defaultProps = {
        selectedIndex: 0
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: this.props.selectedIndex,
            layout: { width: 0, height: 0 }
        }
        this.onSelectTabItem = this.onSelectTabItem.bind(this);
        this.handleLayout = this.handleLayout.bind(this);
    }

    onSelectTabItem(index) {
        this.setState({selectedIndex: index});
    }

    handleLayout (e) {
        const { height, width } = e.nativeEvent.layout;
    
        if (this.state.layout.width === width && this.state.layout.height === height) {
            return;
        }
    
        this.setState({
            layout: {
                height,
                width
            }
        });
    }

    render() {
        
        return (
            <View onLayout={this.handleLayout}>
                <View style={{flexDirection: 'row', flex: 1, backgroundColor: CommonStyles.SEPARATOR_COLOR}}>
                {
                    this.props.tabBarItems.map((tabBarItem, index) => 
                        <TabBarItem
                            key={index}
                            index={index}
                            selected={index === this.state.selectedIndex}
                            caption={tabBarItem.caption}
                            icon={tabBarItem.icon}
                            onSelectTabItem={this.onSelectTabItem}
                            animationDuration={this.props.animationDuration}
                        />        
                    )
                }
                </View>
                <View style={{flex: 1, flexDirection: 'row', height: 3}}>
                    <TabBarIndicator
                        itemsCount={this.props.tabBarItems.length}
                        selectedIndex={this.state.selectedIndex} 
                        layout={this.state.layout}
                        animationDuration={this.props.animationDuration}
                    />
                </View>
                {
                    this.props.children[this.state.selectedIndex]
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabBarIndicator: {
        backgroundColor: CommonStyles.SELECTED_TEXT_COLOR,
        position: 'absolute',
        bottom: 0,
        height: 3
    },
    tabBarItemStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 5
    }
});