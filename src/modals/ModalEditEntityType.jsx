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
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { Remove, Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const initialState = {
  entityType: {
    name: '',
    privateCode: '',
    codeSpace: '',
    classifications: [],
  },
  isCreatingNewClassification: false,
  tempClassification: {
    name: '',
    privateCode: '',
  },
};

class ModalEditEntityType extends React.Component {
  constructor(props) {
    super(props);
    this.classificationsRef = React.createRef();
    // Ensure classifications is always an array
    const entityType = props.entityType
      ? {
          ...props.entityType,
          classifications: props.entityType.classifications || [],
        }
      : initialState.entityType;

    this.state = {
      ...initialState,
      entityType: entityType,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.entityType && this.props.entityType !== prevProps.entityType) {
      this.setState({
        entityType: {
          ...this.props.entityType,
          classifications: this.props.entityType.classifications || [],
        },
      });
    }
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
        classifications: [...entityType.classifications, tempClassification],
      },
      tempClassification: {
        name: '',
        privateCode: '',
      },
    });
  }

  handleRemoveClassification() {
    const classifications = this.classificationsRef.current;
    const index = classifications.options.selectedIndex;

    if (index > -1) {
      this.setState({
        entityType: {
          ...this.state.entityType,
          classifications: [
            ...this.state.entityType.classifications.slice(0, index),
            ...this.state.entityType.classifications.slice(index + 1),
          ],
        },
      });
    }
  }

  render() {
    const { isModalOpen, handleSubmit, codeSpaces } = this.props;

    const { entityType, isCreatingNewClassification, tempClassification } = this.state;

    const isClassificationPrivateCodeTaken =
      (entityType.classifications || [])
        .map(c => c.privateCode)
        .indexOf(tempClassification.privateCode) > -1;
    const isSavable =
      entityType.name.length && entityType.codeSpace.length && entityType.privateCode.length;

    const actions = [
      <Button variant="text" disabled={!isSavable} onClick={this.handleOnClose.bind(this)}>
        Close
      </Button>,
      <Button variant="text" disabled={!isSavable} onClick={() => handleSubmit(entityType)}>
        Update
      </Button>,
    ];

    return (
      <Dialog open={isModalOpen} onClose={() => this.handleOnClose()} maxWidth="md" fullWidth>
        <DialogTitle>Editing entity type</DialogTitle>
        <DialogContent>
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <TextField
                placeholder="Name"
                label="Name"
                value={entityType.name}
                onChange={e =>
                  this.setState({
                    entityType: { ...entityType, name: e.target.value },
                  })
                }
                fullWidth={true}
              />
              <TextField
                placeholder="private code"
                label="Private code"
                disabled={true}
                value={entityType.privateCode}
                onChange={e =>
                  this.setState({
                    entityType: { ...entityType, privateCode: e.target.value },
                  })
                }
                fullWidth={true}
              />
              <FormControl fullWidth>
                <InputLabel id="codespace-label-edit">Codespace</InputLabel>
                <Select
                  labelId="codespace-label-edit"
                  label="Codespace"
                  disabled={true}
                  value={entityType.codeSpace}
                  onChange={e =>
                    this.setState({
                      entityType: { ...entityType, codeSpace: e.target.value },
                    })
                  }
                >
                  {codeSpaces.map(codeSpace => (
                    <MenuItem key={codeSpace.id} value={codeSpace.id}>
                      {codeSpace.xmlns}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div style={{ width: '100%', fontSize: 12 }}>Entity classifications</div>
              <select
                multiple="multiple"
                style={{ width: '100%', fontSize: 12, minHeight: '60px' }}
                ref={this.classificationsRef}
                size={Math.max(3, (entityType.classifications || []).length)}
              >
                {(entityType.classifications || []).map((et, index) => (
                  <option key={'ec-' + index}>{this.getClassificationTitle(et)}</option>
                ))}
              </select>
              <div style={{ textAlign: 'left', width: '100%' }}>
                <IconButton
                  onClick={() => this.setState({ isCreatingNewClassification: true })}
                  size="large"
                >
                  <Add style={{ color: '#228B22' }} />
                </IconButton>
                <IconButton onClick={this.handleRemoveClassification.bind(this)} size="large">
                  <Remove style={{ color: '#cc0000' }} />
                </IconButton>
              </div>
              {isCreatingNewClassification ? (
                <div style={{ border: '1px dotted', width: '100%' }}>
                  <div
                    style={{
                      fontSize: 12,
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    New classification
                  </div>
                  <TextField
                    placeholder="Name"
                    label="Name"
                    value={tempClassification.name}
                    onChange={e =>
                      this.setState({
                        tempClassification: {
                          ...tempClassification,
                          name: e.target.value,
                        },
                      })
                    }
                    fullWidth={true}
                  />
                  <TextField
                    placeholder="Private code"
                    label="Private code"
                    error={isClassificationPrivateCodeTaken}
                    helperText={
                      isClassificationPrivateCodeTaken ? 'Private code is already taken' : ''
                    }
                    onChange={e =>
                      this.setState({
                        tempClassification: {
                          ...tempClassification,
                          privateCode: e.target.value,
                        },
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
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }
}

export default ModalEditEntityType;
