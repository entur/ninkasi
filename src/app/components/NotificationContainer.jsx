/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SuppliersActions from 'actions/SuppliersActions';
import NotificationSystem from 'react-notification-system';

class NotificationContainer extends Component {
  constructor(props) {
    super(props);
    this.notificationSystemRef = React.createRef();
  }

  componentDidMount() {
    this.notificationSystem = this.notificationSystemRef.current;
  }

  componentWillReceiveProps(newProps) {
    const { message, level } = newProps.notification;
    this.notificationSystem.addNotification({
      message,
      level
    });
  }

  render() {
    return <NotificationSystem ref={this.notificationSystemRef} />;
  }
}

function mapStateToProps(state) {
  return {
    notification: state.UtilsReducer.notification
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        addNotification: SuppliersActions.addNotification
      },
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationContainer);
