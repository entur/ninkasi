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
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

class ConfirmationDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    actionBtnTitle: PropTypes.string.isRequired,
  };

  render() {
    const actions = [
      <Button variant="text" color="primary" onClick={this.props.handleClose}>
        Cancel
      </Button>,
      <Button variant="text" color="primary" onClick={this.props.handleSubmit}>
        {this.props.actionBtnTitle}
      </Button>,
    ];

    return (
      <Dialog open={this.props.open} maxWidth="sm" fullWidth>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>{this.props.body}</DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmationDialog;
