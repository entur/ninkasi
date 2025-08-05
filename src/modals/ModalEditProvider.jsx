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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import withAuth from 'utils/withAuth';
import TextField from '@mui/material/TextField';
import { Checkbox } from '@mui/material';
import { FormControl, Select, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import { connect } from 'react-redux';
import SuppliersActions from 'actions/SuppliersActions';
import TransportModesPopover from './TransportModesPopover';
import { Tooltip, styled } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const LightTooltip = styled(Tooltip)(() => ({
  '& .MuiTooltip-tooltip': {
    fontSize: 12
  }
}));

const getEmptyForm = () => ({
  _providerId: null,
  _name: '',
  _chouetteInfoId: null,
  _xmlns: '',
  _xmlnsurl: '',
  _referential: '',
  _organisation: '',
  _user: '',
  _allowCreateMissingStopPlace: false,
  _generateDatedServiceJourneyIds: false,
  _generateMissingServiceLinksForModes: [],
  _migrateDataToProvider: null,
  _enableAutoImport: false,
  _enableAutoValidation: false,
  _enableBlocksExport: false
});

const validate = values => {
  const errors = {};
  if (!values._name.length) {
    errors._name = 'Required';
  } else if (!values._referential.length) {
    errors._referential = 'Required';
  } else if (!/^(rb_)?[a-z]{3}$/.test(values._referential)) {
    errors._referential = 'Invalid format';
  } else if (!values._organisation.length) {
    errors._organisation = 'Required';
  } else if (!values._user.length) {
    errors._user = 'Required';
  } else if (
    values._referential.indexOf('rb_') !== 0 &&
    !values._migrateDataToProvider
  ) {
    errors._migrateDataToProvider = 'Required';
  }
  return errors;
};

class ModalEditProvider extends Component {
  state = {
    form: getEmptyForm(),
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.provider !== null && nextProps.shouldUpdate) {
      const { provider } = nextProps;
      const { name } = provider;
      const {
        xmlns,
        xmlnsurl,
        referential,
        organisation,
        user,
        allowCreateMissingStopPlace,
        generateDatedServiceJourneyIds,
        generateMissingServiceLinksForModes,
        migrateDataToProvider,
        enableAutoImport,
        enableAutoValidation,
        enableBlocksExport
      } = provider.chouetteInfo;
      const form = {
        _providerId: provider.id,
        _name: name,
        _chouetteInfoId: provider.chouetteInfo.id,
        _xmlns: xmlns,
        _xmlnsurl: xmlnsurl,
        _referential: referential,
        _organisation: organisation,
        _user: user,
        _allowCreateMissingStopPlace: allowCreateMissingStopPlace,
        _generateDatedServiceJourneyIds: generateDatedServiceJourneyIds,
        _generateMissingServiceLinksForModes: generateMissingServiceLinksForModes,
        _migrateDataToProvider: migrateDataToProvider,
        _enableAutoImport: enableAutoImport,
        _enableAutoValidation: enableAutoValidation,
        _enableBlocksExport: enableBlocksExport
      };
      this.setState({ form, errors: {} });
    } else {
      this.setState({ form: getEmptyForm(), errors: {} });
    }
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(SuppliersActions.getTransportModes(this.props.getToken));
  }

  getTitle() {
    const { provider, shouldUpdate } = this.props;
    if (provider && provider.id && shouldUpdate) {
      return `Edit ${provider.name} (${provider.id})`;
    }
    return 'Create new provider';
  }

  isEdit() {
    const { provider, shouldUpdate } = this.props;
    return provider && provider.id && shouldUpdate;
  }

  handleCheckTransportMode(transportMode, isChecked) {
    let transportModes = this.state.form._generateMissingServiceLinksForModes;
    var idx = transportModes.indexOf(transportMode);
    if (isChecked && idx === -1) {
      transportModes = transportModes.concat(transportMode);
    } else if (!isChecked && idx >= 0) {
      transportModes = [
        ...transportModes.slice(0, idx),
        ...transportModes.slice(idx + 1)
      ];
    }
    this.setState(state => {
      const newState = Object.assign({}, state);
      newState.form._generateMissingServiceLinksForModes = transportModes;
      return newState;
    });
  }

  handleChange(field, value) {
    const updatedForm = Object.assign({}, this.state.form);
    updatedForm[field] = value;

    let errors = {};
    if (!this.isEdit()) {
      errors = validate(updatedForm);

      if (field === '_referential') {
        updatedForm._xmlns = value.toUpperCase().replace('RB_', '');
        updatedForm._xmlnsurl = `http://www.rutebanken.org/ns/${value
          .toLowerCase()
          .replace('rb_', '')}`;
      }
    }
    this.setState({ form: updatedForm, errors });
  }

  handleSubmit() {
    const { form } = this.state;
    const errors = validate(form);
    if (!Object.keys(errors).length) {
      this.props.handleSubmit(form);
    } else {
      console.error(errors);
      // display error msg?
    }
  }

  toolTip(title) {
    return (
      <LightTooltip arrow placement="right" title={title}>
        <span className="question-icon">
          <HelpOutlineIcon style={{ paddingTop: '5px' }} />
        </span>
      </LightTooltip>
    );
  }

  render() {
    const { open, providers, handleClose, allTransportModes } = this.props;

    if (!this.state) return null;

    const { errors } = this.state;

    const title = this.getTitle();
    const isEdit = this.isEdit();

    const rowStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    };

    const formElement = {
      display: 'flex',
      alignItems: 'center'
    };

    const actions = [
      <Button
        variant="text"
        onClick={() => {
          handleClose();
        }}
      >
        Cancel
      </Button>,
      <Button
        variant="text"
        color="primary"
        onClick={() => {
          this.handleSubmit();
        }}
      >
        Update
      </Button>
    ];

    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <div style={rowStyle}>
            <TextField
              label={'Name'}
              value={this.state.form._name}
              style={{ flex: 1 }}
              onChange={e => this.handleChange('_name', e.target.value)}
              error={!!errors._name}
              helperText={errors._name || ''}
            />
            <TextField
              disabled={isEdit}
              label={'Chouette referential name'}
              value={this.state.form._referential}
              style={{ flex: 1, padding: '0 15px' }}
              onChange={e => this.handleChange('_referential', e.target.value)}
              error={!!errors._referential}
              helperText={errors._referential || ''}
            />
          </div>
          <div style={rowStyle}>
            <TextField
              disabled={isEdit}
              label={'Organisation'}
              value={this.state.form._organisation}
              style={{ flex: 1 }}
              onChange={e => this.handleChange('_organisation', e.target.value)}
              error={!!errors._organisation}
              helperText={errors._organisation || ''}
            />
            <TextField
              disabled={isEdit}
              label={'User'}
              value={this.state.form._user}
              style={{ flex: 1, padding: '0 15px' }}
              onChange={e => this.handleChange('_user', e.target.value)}
              error={!!errors._user}
              helperText={errors._user || ''}
            />
          </div>
          <div style={rowStyle}>
            <TextField
              disabled={isEdit}
              label={'xmlns'}
              value={this.state.form._xmlns}
              style={{ flex: 1 }}
              onChange={e => this.handleChange('_xmlns', e.target.value)}
            />
            <TextField
              disabled={isEdit}
              label={'xmlns URL'}
              value={this.state.form._xmlnsurl}
              style={{ flex: 1, padding: '0 15px' }}
              onChange={e => this.handleChange('_xmlnsurl', e.target.value)}
            />
          </div>
          <div style={rowStyle}>
            <FormControl style={{ flex: 1 }}>
              <Select
                value={this.state.form._migrateDataToProvider}
                onChange={e =>
                  this.handleChange('_migrateDataToProvider', e.target.value)
                }
                displayEmpty
              >
                <MenuItem value={null} style={{ fontStyle: 'italic' }}>
                  None
                </MenuItem>
                {providers
                  .filter(
                    provider => !provider.chouetteInfo.migrateDataToProvider
                  )
                  .map(provider => {
                    return (
                      <MenuItem
                        key={'provider-' + provider.id}
                        value={provider.id}
                      >
                        {provider.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>

          {this.state.form._referential.indexOf('rb_') !== 0 && (
            <>
              <div style={{ ...rowStyle, marginTop: 10 }}>
                <TransportModesPopover
                  allTransportModes={allTransportModes}
                  transportModes={
                    this.state.form._generateMissingServiceLinksForModes
                  }
                  handleCheckTransportMode={this.handleCheckTransportMode.bind(
                    this
                  )}
                />
              </div>
              <div style={{ ...rowStyle, marginTop: 10 }}>
                <div style={{ ...formElement }}>
                  <Checkbox
                    label="Allow create missing stop place"
                    checked={this.state.form._allowCreateMissingStopPlace}
                    style={{ flex: 1, maxWidth: 360, whiteSpace: 'nowrap' }}
                    labelStyle={{ fontSize: '0.9em' }}
                    onCheck={(e, v) =>
                      this.handleChange('_allowCreateMissingStopPlace', v)
                    }
                  />
                  {this.toolTip(
                    'Allow Chouette to create new stop places in its database. ' +
                      'Since stop places should be already present in the Chouette database (imported from NSR) the default setting is "off". ' +
                      'Used only when testing non-Norwegian datasets'
                  )}
                </div>
              </div>
              <div style={{ ...rowStyle, marginTop: 10 }}>
                <div style={{ ...formElement }}>
                  <Checkbox
                    label="Enable auto import"
                    checked={this.state.form._enableAutoImport}
                    style={{ flex: 1, maxWidth: 360, whiteSpace: 'nowrap' }}
                    labelStyle={{ fontSize: '0.9em' }}
                    onCheck={(e, v) =>
                      this.handleChange('_enableAutoImport', v)
                    }
                  />
                  {this.toolTip(
                    'Automatically trigger the import pipeline after a file delivery, ' +
                      'either through the operator portal or the HTTP endpoint. ' +
                      'If disabled the received file is saved in the file storage but not imported'
                  )}
                </div>
              </div>
              <div style={{ ...rowStyle, marginTop: 10 }}>
                <div style={{ ...formElement }}>
                  <Checkbox
                    label="Generate DatedServiceJourneyIds"
                    checked={this.state.form._generateDatedServiceJourneyIds}
                    style={{ flex: 1, maxWidth: 360, whiteSpace: 'nowrap' }}
                    labelStyle={{ fontSize: '0.9em' }}
                    onCheck={(e, v) =>
                      this.handleChange('_generateDatedServiceJourneyIds', v)
                    }
                  />
                  {this.toolTip(
                    'Deprecated. Generates a dated NeTEx export to be processed by Namtar'
                  )}
                </div>
              </div>
            </>
          )}
          <div style={{ ...rowStyle, marginTop: 10 }}>
            <div style={{ ...formElement }}>
              <Checkbox
                label="Enable auto validation"
                checked={this.state.form._enableAutoValidation}
                style={{ flex: 1, maxWidth: 360, whiteSpace: 'nowrap' }}
                labelStyle={{ fontSize: '0.9em' }}
                onCheck={(e, v) =>
                  this.handleChange('_enableAutoValidation', v)
                }
              />
              {this.toolTip(
                this.state.form._referential.indexOf('rb_') !== 0
                  ? 'Allow Chouette to create new stop places in its database. ' +
                      'Since stop places should be already present in the Chouette database (imported from NSR) the default setting is "off". ' +
                      'Used only when testing non-Norwegian datasets'
                  : 'Enable nightly automatic triggering of "validation Level 2" steps. ' +
                      'This option does not affect the execution of the "validation Level 2" step triggered by a file delivery.'
              )}
            </div>
          </div>
          {this.state.form._referential.indexOf('rb_') === 0 && (
            <div style={{ ...rowStyle, marginTop: 10 }}>
              <div style={{ ...formElement }}>
                <Checkbox
                  label="Enable private export (blocks and restricted publication)"
                  checked={this.state.form._enableBlocksExport}
                  style={{ flex: 1, maxWidth: 360, whiteSpace: 'nowrap' }}
                  labelStyle={{ fontSize: '0.9em' }}
                  onCheck={(e, v) =>
                    this.handleChange('_enableBlocksExport', v)
                  }
                />
                {this.toolTip(
                  'When activated, a second NeTEx export is generated, ' +
                    'that will include private/sensitive data ' +
                    '(Blocks, DeadRuns, ServiceJourneys marked with publication=restricted). ' +
                    'This export is accessible only through a private, authorized API.'
                )}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  allTransportModes: state.SuppliersReducer.allTransportModes
});

export default connect(mapStateToProps)(withAuth(ModalEditProvider));
