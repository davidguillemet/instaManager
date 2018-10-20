import React from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

import CommonStyles from '../styles/common';
import Ionicons from 'react-native-vector-icons/Ionicons';

class ModalTemplate extends React.PureComponent {

    static propTypes = {
        title: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
        this.onValidate = this.onValidate.bind(this);
    }

    onClose() {
        this.props.navigation.goBack(null);
    }

    onValidate() {
        this.props.onValidate();
        this.onClose();
    }

    render () {
        return (
            <View style={CommonStyles.styles.standardPage}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, marginBottom: 20}}>
                    <TouchableOpacity onPress={this.onClose} style={{position: 'absolute', left: 0, top: 0}}>
                        <Ionicons style={{color: CommonStyles.GLOBAL_FOREGROUND}} name={'ios-close'} size={50}/>
                    </TouchableOpacity>
                    {
                        this.props.title ?
                        <Text style={[CommonStyles.styles.mediumLabel, {paddingVertical: CommonStyles.GLOBAL_PADDING }]}>{this.props.title}</Text> :
                        null
                    } 
                    {
                        this.props.onValidate ?
                        <TouchableOpacity onPress={this.onValidate} style={{position: 'absolute', right: 0, top: 0}}>
                            <Ionicons style={{color: CommonStyles.GLOBAL_FOREGROUND}} name={'md-checkmark'} size={40}/>
                        </TouchableOpacity>
                        :
                        null
                    }
                </View>
                { this.props.children }
            </View>
        );
    }
}

export default withNavigation(ModalTemplate);