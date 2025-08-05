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
import Modal from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from '@mui/material/Button';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import MdRemove from 'material-ui/svg-icons/content/remove';
import MdAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';

const initialState = {
  entityType: {
    name: '',
    privateCode: '',
    codeSpace: '',
    classifications: []
  },
  isCreatingNewClassification: false,
  tempClassification: {
    name: '',
    privateCode: ''
  }
};

class ModalCreateEntityType extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleOnClose() {
    this.setState(initialState);
    this.props.handleCloseModal();
  }

  getClassificationTitle = classification => {
    return `name=${classification.name}, privateCode=${classification.privateCode}`;
  };

  handleAddClassification() {
    const { entityType, tempClassification } = this.state;
    this.setState({
      ...this.state,
      isCreatingNewClassification: false,
      entityType: {
        ...entityType,
        classifications: [...entityType.classifications, tempClassification]
      },
      tempClassification: {
        name: '',
        privateCode: ''
      }
    });
  }

  handleRemoveClassification() {
    const { classifications } = this.refs;
    const index = classifications.options.selectedIndex;

    if (index > -1) {
      this.setState({
        entityType: {
          ...this.state.entityType,
          classifications: [
            ...this.state.entityType.classifications.slice(0, index),
            ...this.state.entityType.classifications.slice(index + 1)
          ]
        }
      });
    }
  }

  render() {
    const {
      isModalOpen,
      handleSubmit,
      takenPrivateCodes,
      codeSpaces
    } = this.props;

    const {
      entityType,
      isCreatingNewClassification,
      tempClassification
    } = this.state;

    const invalidPrivateCode =
      takenPrivateCodes.indexOf(entityType.privateCode) > -1;
    const isClassificationPrivateCodeTaken =
      entityType.classifications
        .map(c => c.privateCode)
        .indexOf(tempClassification.privateCode) > -1;
    const isSavable =
      !invalidPrivateCode &&
      entityType.name.length &&
      entityType.codeSpace.length &&
      entityType.privateCode.length;

    const actions = [
      <Button variant="text" onClick={this.handleOnClose.bind(this)}>
        Close
      </Button>,
      <Button
        variant="text"
        disabled={!isSavable}
        onClick={() => handleSubmit(entityType)}
      >
        Create
      </Button>
    ];

    return (
      <Modal
        actions={actions}
        open={isModalOpen}
        onRequestClose={this.handleOnClose.bind(this)}
        title="Create a new entity type"
        contentStyle={{ width: '40%' }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <TextField
              hintText="Name"
              floatingLabelText="Name"
              value={entityType.name}
              onChange={(e, value) =>
                this.setState({
                  entityType: { ...entityType, name: value }
                })
              }
              fullWidth={true}
            />
            <TextField
              hintText="private code"
              floatingLabelText="Private code"
              errorText={
                invalidPrivateCode ? 'Private code already exists' : ''
              }
              value={entityType.privateCode}
              onChange={(e, value) =>
                this.setState({
                  entityType: { ...entityType, privateCode: value }
                })
              }
              fullWidth={true}
              errorStyle={{ float: 'right' }}
            />
            <SelectField
              hintText="Code space"
              floatingLabelText="Code space"
              value={entityType.codeSpace}
              onChange={(e, index, value) =>
                this.setState({
                  entityType: { ...entityType, codeSpace: value }
                })
              }
              fullWidth={true}
            >
              {codeSpaces.map(codeSpace => (
                <MenuItem
                  key={codeSpace.id}
                  id={codeSpace.id}
                  value={codeSpace.id}
                  label={codeSpace.id}
                  primaryText={codeSpace.xmlns}
                />
              ))}
            </SelectField>
            <div style={{ width: '100%', fontSize: 12 }}>
              Entity classifications
            </div>
            <select
              multiple="multiple"
              style={{ width: '100%', fontSize: 12 }}
              ref="classifications"
            >
              {entityType.classifications.map((et, index) => (
                <option key={'ec-' + index}>
                  {this.getClassificationTitle(et)}{' '}
                </option>
              ))}
            </select>
            <div style={{ textAlign: 'left', width: '100%' }}>
              <IconButton
                onClick={() =>
                  this.setState({ isCreatingNewClassification: true })
                }
                size="large"
              >
                <MdAdd color="#228B22" />
              </IconButton>
              <IconButton
                onClick={this.handleRemoveClassification.bind(this)}
                size="large"
              >
                <MdRemove color="#cc0000" />
              </IconButton>
            </div>
            {isCreatingNewClassification ? (
              <div style={{ border: '1px dotted', width: '100%' }}>
                <div
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    fontWeight: 600
                  }}
                >
                  New classification
                </div>
                <TextField
                  hintText="Name"
                  floatingLabelText="Name"
                  value={tempClassification.name}
                  onChange={(e, value) =>
                    this.setState({
                      tempClassification: {
                        ...tempClassification,
                        name: value
                      }
                    })
                  }
                  fullWidth={true}
                />
                <TextField
                  hintText="Private code"
                  floatingLabelText="Private code"
                  errorStyle={{ float: 'right' }}
                  errorText={
                    isClassificationPrivateCodeTaken
                      ? 'Private code is already taken'
                      : ''
                  }
                  onChange={(e, value) =>
                    this.setState({
                      tempClassification: {
                        ...tempClassification,
                        privateCode: value
                      }
                    })
                  }
                  value={tempClassification.privateCode}
                  fullWidth={true}
                />
                <Button
                  variant="text"
                  style={{ width: '100%' }}
                  disabled={
                    isClassificationPrivateCodeTaken ||
                    !tempClassification.name.length ||
                    !tempClassification.privateCode.length
                  }
                  onClick={this.handleAddClassification.bind(this)}
                >
                  Add
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalCreateEntityType;
