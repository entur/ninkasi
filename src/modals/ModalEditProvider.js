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
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import SuppliersActions from 'actions/SuppliersActions';
import TransportModesPopover from './TransportModesPopover';
import { Tooltip } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { withStyles } from '@material-ui/core/styles';

const LightTooltip = withStyles(() => ({
  tooltip: {
    fontSize: 12
  }
}))(Tooltip);

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
    dispatch(SuppliersActions.getTransportModes());
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
      <FlatButton
        label="Cancel"
        primary={false}
        onClick={() => {
          handleClose();
        }}
      />,
      <FlatButton
        label="Update"
        primary={true}
        onClick={() => {
          this.handleSubmit();
        }}
      />
    ];

    return (
      <Dialog
        title={title}
        open={open}
        actions={actions}
        onRequestClose={handleClose}
      >
        <div style={rowStyle}>
          <TextField
            floatingLabelText={'Name'}
            floatingLabelFixed={true}
            value={this.state.form._name}
            style={{ flex: 1 }}
            onChange={(e, v) => this.handleChange('_name', v)}
            errorText={errors._name && errors._name}
          />
          <TextField
            disabled={isEdit}
            floatingLabelText={'Chouette referential name'}
            floatingLabelFixed={true}
            value={this.state.form._referential}
            style={{ flex: 1, padding: '0 15px' }}
            onChange={(e, v) => this.handleChange('_referential', v)}
            errorText={errors._referential && errors._referential}
          />
        </div>
        <div style={rowStyle}>
          <TextField
            disabled={isEdit}
            floatingLabelText={'Organisation'}
            floatingLabelFixed={true}
            value={this.state.form._organisation}
            style={{ flex: 1 }}
            onChange={(e, v) => this.handleChange('_organisation', v)}
            errorText={errors._organisation && errors._organisation}
          />
          <TextField
            disabled={isEdit}
            floatingLabelText={'User'}
            floatingLabelFixed={true}
            value={this.state.form._user}
            style={{ flex: 1, padding: '0 15px' }}
            onChange={(e, v) => this.handleChange('_user', v)}
            errorText={errors._user && errors._user}
          />
        </div>
        <div style={rowStyle}>
          <TextField
            disabled={isEdit}
            floatingLabelText={'xmlns'}
            floatingLabelFixed={true}
            value={this.state.form._xmlns}
            style={{ flex: 1 }}
            onChange={(e, v) => this.handleChange('_xmlns', v)}
          />
          <TextField
            disabled={isEdit}
            floatingLabelText={'xmlns URL'}
            floatingLabelFixed={true}
            value={this.state.form._xmlnsurl}
            style={{ flex: 1, padding: '0 15px' }}
            onChange={(e, v) => this.handleChange('_xmlnsurl', v)}
          />
        </div>
        <div style={rowStyle}>
          <SelectField
            floatingLabelText="Migrate data to provider"
            floatingLabelFixed={true}
            style={{ flex: 1 }}
            value={this.state.form._migrateDataToProvider}
            onChange={(e, i, v) =>
              this.handleChange('_migrateDataToProvider', v)
            }
            autoWidth={true}
            errorText={
              errors._migrateDataToProvider && errors._migrateDataToProvider
            }
          >
            <MenuItem
              value={null}
              primaryText="None"
              style={{ fontStyle: 'italic' }}
            />
            {providers
              .filter(provider => !provider.chouetteInfo.migrateDataToProvider)
              .map(provider => {
                return (
                  <MenuItem
                    key={'provider-' + provider.id}
                    value={provider.id}
                    primaryText={provider.name}
                  />
                );
              })}
          </SelectField>
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
                  onCheck={(e, v) => this.handleChange('_enableAutoImport', v)}
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
              onCheck={(e, v) => this.handleChange('_enableAutoValidation', v)}
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
                onCheck={(e, v) => this.handleChange('_enableBlocksExport', v)}
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
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  allTransportModes: state.SuppliersReducer.allTransportModes
});

export default connect(mapStateToProps)(ModalEditProvider);
