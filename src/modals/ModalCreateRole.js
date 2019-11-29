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

import React from "react";
import Modal from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";

const initialState = {
  role: {
    name: "",
    privateCode: ""
  }
};

class ModalCreateRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleOnClose() {
    this.setState(initialState);
    this.props.handleCloseModal();
  }

  render() {
    const { isModalOpen, handleSubmit, takenPrivateCodes } = this.props;

    const { role } = this.state;

    const invalidPrivateCode = takenPrivateCodes.indexOf(role.privateCode) > -1;

    const actions = [
      <FlatButton
        disabled={invalidPrivateCode}
        label="Close"
        onClick={this.handleOnClose.bind(this)}
      />,
      <FlatButton
        disabled={invalidPrivateCode}
        label="Create"
        onClick={() => handleSubmit(role)}
      />
    ];

    return (
      <Modal
        open={isModalOpen}
        actions={actions}
        contentStyle={{ width: "30%" }}
        title="Create a new role"
        onRequestClose={() => this.handleOnClose()}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <TextField
            hintText="Name"
            floatingLabelText="Name"
            value={role.name}
            onChange={(e, value) =>
              this.setState({
                role: { ...role, name: value }
              })
            }
            fullWidth={true}
          />
          <TextField
            hintText="private code"
            floatingLabelText="Private code"
            errorText={invalidPrivateCode ? "Private code already exists" : ""}
            value={role.privateCode}
            onChange={(e, value) =>
              this.setState({
                role: { ...role, privateCode: value }
              })
            }
            fullWidth={true}
          />
        </div>
      </Modal>
    );
  }
}

export default ModalCreateRole;
