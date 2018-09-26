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
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

class ConfirmationDialog extends React.Component {

  static PropTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    actionBtnTitle: PropTypes.func.isRequired,
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        label={this.props.actionBtnTitle}
        primary={true}
        onTouchTap={this.props.handleSubmit}
      />
    ];

    return (
      <Dialog
        title={this.props.title}
        actions={actions}
        modal={true}
        open={this.props.open}
      >
        {this.props.body}
      </Dialog>
    );
  }
}

export default ConfirmationDialog;
