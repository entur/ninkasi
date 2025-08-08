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

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NotificationAddEntityClassRef from './NotificationAddEntityClassRef';
import { IconButton } from '@mui/material';
import { Remove } from '@mui/icons-material';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';

class NotificationEntityClassRef extends React.Component {
  constructor(props) {
    super(props);
    this.entityRefsRef = React.createRef();
  }

  static propTypes = {
    notification: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired
  };

  handleRemoveEntityClass() {
    const entityRefs = this.entityRefsRef.current;
    const { dispatch, index, notification } = this.props;
    const selectedIndex = entityRefs.options.selectedIndex;
    const entityClassRefs =
      notification.eventFilter.entityClassificationRefs || [];
    const entityClassToRemove = entityClassRefs[selectedIndex];

    if (entityClassToRemove) {
      dispatch(
        OrganizationRegisterActions.removeEntityClassRefNotification(
          index,
          entityClassToRemove
        )
      );
    }
  }

  render() {
    const { notification, visible } = this.props;

    const entityClassRefs =
      notification.eventFilter.entityClassificationRefs || [];

    return (
      <div
        style={{
          display: visible ? 'none' : 'flex',
          flexDirection: 'column',
          flex: 2,
          border: '1px solid #eee',
          marginTop: 10,
          padding: 5
        }}
      >
        <div style={{ width: '100%', fontSize: 12, fontWeight: 600 }}>
          Entity classification
          <span style={{ color: 'red', fontSize: 10 }}>*</span>
        </div>
        <div style={{ display: 'flex' }}>
          <select
            multiple="multiple"
            ref={this.entityRefsRef}
            style={{ width: '100%', fontSize: 12, flex: 2 }}
          >
            {entityClassRefs.map((ref, index) => (
              <option key={'entity-' + index}>{ref} </option>
            ))}
          </select>
          <IconButton
            onClick={this.handleRemoveEntityClass.bind(this)}
            size="large"
          >
            <Remove style={{ color: '#cc0000' }} />
          </IconButton>
        </div>
        {entityClassRefs.length === 0 && (
          <span
            style={{
              fontSize: 12,
              color: 'red',
              textAlign: 'left'
            }}
          >
            Required set of entity classifications can not be empty
          </span>
        )}
        <NotificationAddEntityClassRef index={this.props.index} />
      </div>
    );
  }
}

export default connect()(NotificationEntityClassRef);
