import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import {
    View
} from 'react-native';

import ControlStatus from './ControlStatus';
import ControlBottomNotification from './ControlBottomNotification';

export default function withControlStatus(WrappedComponent) {

    class componentWithControlStatus extends React.Component {
      constructor(props) {
        super(props);
      }
    
      render() {
        return (
            <View style={{flex: 1}}>
                <WrappedComponent {...this.props} />
                <ControlStatus />
                <ControlBottomNotification />
            </View>
        );
      }
    };

    hoistNonReactStatics(componentWithControlStatus, WrappedComponent);
    return componentWithControlStatus;
  }
  