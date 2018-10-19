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
import {connect} from 'react-redux';
import SuppliersActions from '../actions/SuppliersActions';
import TransportModesPopover from './TransportModesPopover';

class ModalEditProvider extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.provider !== null && nextProps.shouldUpdate) {
      const { provider } = nextProps;
      const { name, sftpAccount } = provider;
      const {
        xmlns,
        xmlnsurl,
        referential,
        organisation,
        user,
        regtoppVersion,
        regtoppCoordinateProjection,
        regtoppCalendarStrategy,
        dataFormat,
        enableValidation,
        allowCreateMissingStopPlace,
        enableStopPlaceIdMapping,
        enableCleanImport,
        generateDatedServiceJourneyIds,
        generateMissingServiceLinksForModes,
        googleUpload,
        googleQAUpload,
        migrateDataToProvider,
        enableAutoImport
      } = provider.chouetteInfo;

      this.setState({
        _providerId: provider.id,
        _name: name,
        _sftpAccount: sftpAccount,
        _chouetteInfoId: provider.chouetteInfo.id,
        _xmlns: xmlns,
        _xmlnsurl: xmlnsurl,
        _referential: referential,
        _organisation: organisation,
        _user: user,
        _regtoppVersion: regtoppVersion,
        _regtoppCoordinateProjection: regtoppCoordinateProjection,
        _regtoppCalendarStrategy: regtoppCalendarStrategy,
        _dataFormat: dataFormat,
        _enableValidation: enableValidation,
        _allowCreateMissingStopPlace: allowCreateMissingStopPlace,
        _enableStopPlaceIdMapping: enableStopPlaceIdMapping,
        _enableCleanImport: enableCleanImport,
        _generateDatedServiceJourneyIds: generateDatedServiceJourneyIds,
        _generateMissingServiceLinksForModes: generateMissingServiceLinksForModes,
        _googleUpload: googleUpload,
        _googleQAUpload: googleQAUpload,
        _migrateDataToProvider: migrateDataToProvider,
        _enableAutoImport: enableAutoImport,
      });
    } else {
      this.setState({
        _providerId: null,
        _name: '',
        _sftpAccount: '',
        _chouetteInfoId: null,
        _xmlns: '',
        _xmlnsurl: '',
        _referential: '',
        _organisation: '',
        _user: '',
        _regtoppVersion: null,
        _regtoppCoordinateProjection: '',
        _regtoppCalendarStrategy: '',
        _dataFormat: '',
        _enableValidation: false,
        _allowCreateMissingStopPlace: false,
        _enableStopPlaceIdMapping: false,
        _enableCleanImport: false,
        _generateDatedServiceJourneyIds: false,
        _generateMissingServiceLinksForModes: [],
        _googleUpload: false,
        _googleQAUpload: false,
        _migrateDataToProvider: null,
        _enableAutoImport: false
      });
    }
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(SuppliersActions.getTransportModes());
  }

  getTitle() {
    const { provider, shouldUpdate } = this.props;
    if (provider && provider.id && shouldUpdate) {
      return `Edit ${provider.name} (${provider.id})`;
    }
    return 'Create new provider';
  }

  getProjections() {
    const projections = [
      { value: 'EPSG:32632', text: 'UTM zone 32N' },
      { value: 'EPSG:32633', text: 'UTM zone 33N' },
      { value: 'EPSG:32634', text: 'UTM zone 34N' },
      { value: 'EPSG:32635', text: 'UTM zone 35N' },
      { value: 'EPSG:4326', text: 'WGS 84 / Latlong' }
    ];
    return projections.map( projection => (
        <MenuItem key={'projection-' + projection.value}
            value={projection.value}
            primaryText={projection.text}
        />
    ));
  }
  getVersions() {
    const versions = [
      { value: null, text: 'Auto-detect' },
      { value: 'R11D', text: '1.1D' },
      { value: 'R12', text: '1.2' },
      { value: 'R12N', text: '1.2 Novus' },
      { value: 'R13A', text: '1.3A' },
    ];
    return versions.map( version => (
      <MenuItem key={'version-' + version.value}
                value={version.value}
                primaryText={version.text}
      />
    ));
  }

  getCalendarStrategies() {
    const strategies = [
      { value: '', text: 'None' },
      { value: 'ADD', text: 'Add using DKO-file start-date' },
      { value: 'UPDATE', text: 'Update/overwrite whole adminCode' },
    ];
    return strategies.map( strategy => (
      <MenuItem key={'strategy-' + strategy.value}
                value={strategy.value}
                primaryText={strategy.text}
      />
    ));
  }

  handleCheckTransportMode(transportMode, isChecked) {
    let transportModes = this.state._generateMissingServiceLinksForModes;
    var idx = transportModes.indexOf(transportMode);
    if (isChecked && idx === -1) {
        transportModes = transportModes.concat(transportMode);
    } else if (!isChecked && idx >= 0) {
        transportModes = [
            ...transportModes.slice(0, idx),
            ...transportModes.slice(idx+1)
        ];
    }
    this.setState({_generateMissingServiceLinksForModes: transportModes});
  }


  render() {
    const { open, providers, handleClose, handleSubmit, allTransportModes } = this.props;

    if (!this.state) return null;

    const title = this.getTitle();
    const projections = this.getProjections();
    const versions = this.getVersions();
    const calendarStrategies = this.getCalendarStrategies();

    const rowStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    };

    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={() => {
          handleClose();
        }}
      />,
      <FlatButton
        label="Update"
        primary={true}
        onTouchTap={() => {
          handleSubmit(this.state);
        }}
      />
    ];

    return (
      <Dialog
        title={title}
        open={open}
        actions={actions}
      >
        <div style={rowStyle}>
          <TextField
            floatingLabelText={'Name'}
            floatingLabelFixed={true}
            value={this.state._name}
            style={{ flex: 1 }}
            onChange={(e, v) => this.setState({ _name: v })}
          />
          <TextField
            floatingLabelText={'Chouette referential name'}
            floatingLabelFixed={true}
            value={this.state._referential}
            style={{ flex: 1, padding: '0 15px' }}
            onChange={(e, v) => this.setState({ _referential: v })}
          />
        </div>
        <div style={rowStyle}>
          <TextField
            floatingLabelText={'Organisation'}
            floatingLabelFixed={true}
            value={this.state._organisation}
            style={{ flex: 1 }}
            onChange={(e, v) => this.setState({ _organisation: v })}
          />
          <TextField
            floatingLabelText={'User'}
            floatingLabelFixed={true}
            value={this.state._user}
            style={{ flex: 1, padding: '0 15px' }}
            onChange={(e, v) => this.setState({ _user: v })}
          />
        </div>
        <div style={rowStyle}>
          <div style={{flex: 1}}>
            <SelectField
              value={this.state._regtoppVersion}
              floatingLabelText={'Regtopp version'}
              floatingLabelFixed={true}
              fullWidth={true}
              onChange={(e, k, v) => {
                this.setState({_regtoppVersion: v})
              }}
            >
              {versions}
            </SelectField>
          </div>
         <div style={{padding: '0 15px', flex: 1}}>
           <SelectField
             value={this.state._regtoppCoordinateProjection}
             floatingLabelText={'Regtopp Coordinate Projection'}
             floatingLabelFixed={true}
             fullWidth={true}
             onChange={(e, k, v) => {
               this.setState({_regtoppCoordinateProjection: v})
             }}
           >
             {projections}
           </SelectField>
         </div>
        </div>
        <div style={rowStyle}>
          <div style={{flex: 1}}>
            <SelectField
              value={this.state._regtoppCalendarStrategy}
              floatingLabelText={'Regtopp calendar strategy'}
              floatingLabelFixed={true}
              fullWidth={true}
              onChange={(e, k, v) => {
                this.setState({_regtoppCalendarStrategy: v})
              }}
            >
              {calendarStrategies}
            </SelectField>
          </div>
          <TextField
            floatingLabelText={'Data format'}
            floatingLabelFixed={true}
            value={this.state._dataFormat}
            style={{ flex: 1, padding: '0 15px' }}
            onChange={(e, v) => this.setState({ _dataFormat: v })}
          />
        </div>
        <div style={rowStyle}>
          <TextField
            floatingLabelText={'xmlns'}
            floatingLabelFixed={true}
            value={this.state._xmlns}
            style={{ flex: 1 }}
            onChange={(e, v) => this.setState({ _xmlns: v })}
          />
          <TextField
            floatingLabelText={'xmlns URL'}
            floatingLabelFixed={true}
            value={this.state._xmlnsurl}
            style={{ flex: 1, padding: '0 15px' }}
            onChange={(e, v) => this.setState({ _xmlnsurl: v })}
          />
        </div>
        <div style={rowStyle}>
          <SelectField
            floatingLabelText="Migrate data to provider"
            floatingLabelFixed={true}
            style={{ flex: 1 }}
            value={this.state._migrateDataToProvider}
            onChange={(e, i, v) => this.setState({ _migrateDataToProvider: v })}
            autoWidth={true}
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
          <TextField
            floatingLabelText={'sFtp account'}
            floatingLabelFixed={true}
            value={this.state._sftpAccount}
            style={{ flex: 1, padding: '0 15px' }}
            onChange={(e, v) => this.setState({ _sftpAccount: v })}
          />
        </div>
        <div style={{...rowStyle, marginTop: 10}}>
          <TransportModesPopover
              allTransportModes={allTransportModes}
              transportModes={this.state._generateMissingServiceLinksForModes}
              handleCheckTransportMode={this.handleCheckTransportMode.bind(this)}
          />
        </div>
        <div style={{ ...rowStyle, marginTop: 10 }}>
          <Checkbox
            label="Allow create missing stop place"
            checked={this.state._allowCreateMissingStopPlace}
            style={{ flex: 1, maxWidth: 360 }}
            labelStyle={{ fontSize: '0.9em' }}
            onCheck={(e, v) =>
              this.setState({ _allowCreateMissingStopPlace: v })}
          />
          <Checkbox
            label="Enable stop place Id mapping"
            checked={this.state._enableStopPlaceIdMapping}
            style={{ flex: 1 }}
            labelStyle={{ fontSize: '0.9em' }}
            onCheck={(e, v) => this.setState({ _enableStopPlaceIdMapping: v })}
          />
        </div>
        <div style={{ ...rowStyle, marginTop: 10 }}>
          <Checkbox
            label="Enable clean import"
            checked={this.state._enableCleanImport}
            style={{ flex: 1, maxWidth: 360 }}
            labelStyle={{ fontSize: '0.9em' }}
            onCheck={(e, v) => this.setState({ _enableCleanImport: v })}
          />
          <Checkbox
            label="Enable validation"
            checked={this.state._enableValidation}
            style={{ flex: 1 }}
            labelStyle={{ fontSize: '0.9em' }}
            onCheck={(e, v) => this.setState({ _enableValidation: v })}
          />
        </div>
        <div style={{ ...rowStyle, marginTop: 10 }}>
          <Checkbox
            label="Enable auto import"
            checked={this.state._enableAutoImport}
            style={{ flex: 1, maxWidth: 360 }}
            labelStyle={{ fontSize: '0.9em' }}
            onCheck={(e, v) => this.setState({ _enableAutoImport: v })}
          />
          <Checkbox
              label="Generate DatedServiceJourneyIds"
              checked={this.state._generateDatedServiceJourneyIds}
              style={{ flex: 1 }}
              labelStyle={{ fontSize: '0.9em' }}
              onCheck={(e, v) => this.setState({ _generateDatedServiceJourneyIds: v })}
          />
        </div>
        <div style={{ ...rowStyle, marginTop: 10 }}>
          <Checkbox
              label="Upload to Google (production)"
              checked={this.state._googleUpload}
              style={{ flex: 1, maxWidth: 360 }}
              labelStyle={{ fontSize: '0.9em' }}
              onCheck={(e, v) => this.setState({ _googleUpload: v })}
          />
          <Checkbox
              label="Upload to Google (QA)"
              checked={this.state._googleQAUpload}
              style={{ flex: 1 }}
              labelStyle={{ fontSize: '0.9em' }}
              onCheck={(e, v) => this.setState({ _googleQAUpload: v })}
          />
        </div>
      </Dialog>
    );
  }
}
const mapStateToProps = state => ({
    allTransportModes: state.SuppliersReducer.allTransportModes
});

export default connect(mapStateToProps)(ModalEditProvider);