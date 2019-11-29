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

import React, { Component } from "react";
import PropTypes from "prop-types";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

class ConfirmDialog extends Component {
  handleSubmit() {
    const { handleSubmit, handleClose } = this.props;
    handleClose();
    handleSubmit();
  }

  render() {
    const { handleClose, open, title, info } = this.props;

    const actions = [
      <FlatButton
        label={"Close"}
        onClick={() => {
          handleClose();
        }}
      />,
      <FlatButton label={"Confirm"} onClick={this.handleSubmit.bind(this)} />
    ];

    return (
      <Dialog actions={actions} title={title} open={open}>
        <p>{info}</p>
      </Dialog>
    );
  }
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func,
  title: PropTypes.string,
  info: PropTypes.string
};

export default ConfirmDialog;
