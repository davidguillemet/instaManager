import React from 'react';
import {
    Animated,
    Text,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonStyles from '../styles/common';

export const NotificationType = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

export class BottomNotification extends React.PureComponent {

    static propTypes = {
        caption: PropTypes.string.isRequired,       // Nnotification caption - required
        type: PropTypes.string.isRequired,          // NOTIFICATION_SUCCESS, NOTIFICATION_ERROR, ...
        autoclose: PropTypes.bool,                  // True if the notification will close automatically
        duration: PropTypes.number,                 // Duration befoire autoclose (ms)
        manuallyCloseable: PropTypes.bool,          // true if the user can close the notif manually
        animationDuration: PropTypes.number,        // Duration of thr animation (open/close)
        opacity: PropTypes.number                   // opacity of the notification
    };

    static defaultProps = {
        autoclose: true,            // close automatically by default
        duration: 2000,             // will close automatically after 3 s by default
        manuallyCloseable: true,    // manually closeable by default
        animationDuration: 700,     // Animationn lasts 1s
        opacity: 1
    };   

    constructor(props) {
        super(props);
        
        this.state = {
            opacity: 0, // transparent by default
            bottomPosition: null // notification height is not known yet
        }
        
        this.onLayout = this.onLayout.bind(this);
        this.onCloseNotification = this.onCloseNotification.bind(this);
    }

    componentDidUpdate() {
        
        if (this.state.bottomPosition == null) {
            return;
        }

        Animated.timing(
            this.state.bottomPosition,
            {
                toValue: 0, // From negative bottom position to 0
                duration: this.props.animationDuration
            }
        ).start(({finished}) => {
            Animated.sequence([
                Animated.delay(this.props.duration),
                this.getCloseNotificationAnimation()
            ]).start();
        });
    }

    getCloseNotificationAnimation() {
        
        return Animated.timing(
            this.state.bottomPosition,
            {
                toValue: -this.state.height,
                duration: this.props.animationDuration,
            }    
        );
    }

    onCloseNotification() {

        this.getCloseNotificationAnimation().start();
    }

    renderCloseButton() {

        if (this.props.manuallyCloseable) {
            return (
                <TouchableOpacity onPress={this.onCloseNotification}>    
                    <Ionicons name={'ios-close'} style={[CommonStyles.styles.textIcon, { paddingRight: 0, color: CommonStyles.DARK_GREEN}]}/>
                </TouchableOpacity>
            );
        }
    }

    onLayout(event) {

        if (this.state.bottomPosition == null) {
            
            let { height } = event.nativeEvent.layout;
            this.setState({
                height: height,
                opacity: this.props.opacity,
                bottomPosition: new Animated.Value(-height) // hide the notification by default
            });
            return;
        } 
    }

    render() {

        return (
            <Animated.View style={[CommonStyles.styles.standardTile,
                {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    overflow: 'hidden',
                    bottom: this.state.bottomPosition,
                    marginBottom: 0,
                    alignItems: 'center',
                    backgroundColor: CommonStyles.LIGHT_GREEN,
                    borderRadius: 0,
                    opacity: this.state.opacity
                } ]}
                onLayout={this.onLayout}
            >
                <Ionicons name={'ios-checkmark-circle'} style={[CommonStyles.styles.textIcon, { paddingLeft: 0, color: CommonStyles.DARK_GREEN}]}/>
                <Text style={[CommonStyles.styles.smallLabel, {flex: 1, flexWrap: 'wrap', color: CommonStyles.DARK_GREEN}]}>
                    {this.props.caption}
                </Text>
                { this.renderCloseButton() }
            </Animated.View>        
        );
    }

}