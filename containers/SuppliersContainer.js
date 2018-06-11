import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import SuppliersActions from '../actions/SuppliersActions';
import cfgreader from '../config/readConfig';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import MdNew from 'material-ui/svg-icons/content/add';
import MdWarning from 'material-ui/svg-icons/alert/warning';
import { getQueryVariable } from './utils';
import Checkbox from 'material-ui/Checkbox';
import Popover from 'material-ui/Popover';
import MdDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import Divider from 'material-ui/Divider';
import peliasTasks from '../config/peliasTasks';
import moment from 'moment';
import roleParser from '../roles/rolesParser';
import MdEdit from 'material-ui/svg-icons/image/edit';
import GraphStatus from '../components/GraphStatus';
import FlatButton from 'material-ui/FlatButton';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import ConfirmDialog from '../modals/ConfirmDialog';
import { getProvidersEnv, getTheme, getIconColor } from '../config/themes';

class SuppliersContainer extends React.Component {
  constructor(props) {
    super(props);

    let tasks = {};
    peliasTasks.forEach(option => (tasks[option.task] = true));

    this.state = {
      peliasOpen: false,
      anchorEl: null,
      peliasOptions: {
        ...tasks
      },
      confirmDialogOpen: false,
      confirmAction: null,
      confirmTitle: '',
      confirmInfo: '',
      cleanPopoverOpen: false,
      googlePopoverOpen: false,
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    cfgreader.readConfig(
      function(config) {
        window.config = config;
        dispatch(SuppliersActions.getAllProviders());

        if (!!getQueryVariable('id')) {
          dispatch(
            SuppliersActions.selectActiveSupplier(getQueryVariable('id'))
          );
        }
      }.bind(this)
    );
  }

  handleBuildGraph() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Build graph',
      confirmInfo: 'Are you sure you want to build graph?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.buildGraph());
      }
    });
  }

  handleUpdateMapbox() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Update Mapbox',
      confirmInfo: 'Are you sure you want to update Mapbox?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.updateMapbox());
      }
    });
  }

  handleFetchOSM() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Fetch Open Street Map Data',
      confirmInfo: 'Are you sure you want to fetch Open Street Map data?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.fetchOSM());
      }
    });
  }

  handleUploadGoogleProduction() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Upload GTFS data to Google (production)',
      confirmInfo: 'Are you sure you want to upload latest GTFS export to Google (production)?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.uploadGoogleProduction());
      }
    });
  }

    handleUploadGoogleQA() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Upload GTFS data to Google (QA)',
      confirmInfo: 'Are you sure you want to upload latest GTFS export to Google (QA)?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.uploadGoogleQA());
      }
    });
  }

  selectSupplier(value) {
    const { dispatch } = this.props;
    if (value > 0) {
      dispatch(SuppliersActions.selectActiveSupplier(value));
    } else {
      dispatch(SuppliersActions.selectAllSuppliers());
    }
  }

  handleNewProvider() {
    this.props.dispatch(SuppliersActions.openNewProviderDialog());
  }

  handleCancelAllJobs() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Cancel all chouette jobs',
      confirmInfo:
        'Are you want to cancel all chouette jobs for all providers?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.cancelAllChouetteJobsforAllProviders());
      }
    });
  }

  handleCleanAllDataSpaces(filter) {
    let filterText = '';

    switch (filter) {
      case 'level1':
        filterText = ' in level 1 space';
        break;
      case 'level2':
        filterText = ' in level 2 space';
        break;
      default:
        break;
    }

    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Clean Data Spaces',
      confirmInfo: `Are you sure you want to clean all dataspaces for all providers${filterText}?`,
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.cleanAllDataspaces(filter));
      },
      cleanPopoverOpen: false
    });
  }

  handleCleanFileFilter() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Clean File Filter',
      confirmInfo: 'Are you sure you want to clean file filter?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.cleanFileFilter());
      },
      cleanPopoverOpen: false
    });
  }

  handleTogglePeliasOpen(event, open) {
    this.setState({
      peliasOpen: open,
      anchorEl: event.currentTarget
    });
  }

  handlePeliasOptionChecked(event, task) {
    this.setState({
      peliasOptions: Object.assign({}, this.state.peliasOptions, {
        [task]: event.target.checked
      })
    });
  }

  handleExecutePelias() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Execute Pelias tasks',
      confirmInfo: 'Are you sure you want to execute selected pelias tasks?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.executePeliasTask(this.state.peliasOptions));
      },
      peliasOpen: false
    });
  }

  handleClearEventHistory() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Clean All Event History',
      confirmInfo: 'Are you want to clean all event history?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.deleteAllJobs());
      },
      cleanPopoverOpen: false
    });
  }

  handleClearStopPlaces() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Clean Stop Placee Register in Chouette',
      confirmInfo: 'Are you want to clean Stop Place Register in Chouette?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.cleanStopPlacesInChouette());
      },
      cleanPopoverOpen: false
    });
  }

  handleEditProvider() {
    this.props.dispatch(SuppliersActions.openEditProviderDialog());
  }

  handleGoogleOpen(event) {
    event.preventDefault();

    this.setState({
      googlePopoverOpen: true,
      anchorEl: event.currentTarget
    });
  }

  handleCleanOpen(event) {
    event.preventDefault();

    this.setState({
      cleanPopoverOpen: true,
      anchorEl: event.currentTarget
    });
  }

  getColorByStatus(status) {
    switch (status) {
      case 'STARTED':
        return '#08920e';
      case 'OK':
        return '#08920e';
      case 'FAILED':
        return '#990000';
      default:
        return 'grey';
    }
  }

  getLabelByJobType(type) {
    for (let i = 0; i < peliasTasks.length; i++) {
      if (peliasTasks[i].task === type) return peliasTasks[i].label;
    }
  }

  render() {

    const { suppliers, activeProviderId, otherStatus, kc } = this.props;
    const isAdmin = roleParser.isAdmin(kc.tokenParsed);
    const providersEnv = getProvidersEnv(window.config.providersBaseUrl);
    const iconColor = getIconColor(providersEnv);

    const supplierItems = [
      {
        id: -1,
        name: 'All providers'
      }
    ].concat(suppliers);

    let innerContainerStyle = {
      display: 'flex',
      justifyContent: 'center',
      borderTop: '1px solid rgba(158, 158, 158, 0.15)',
      ...getTheme(providersEnv)
    };

    const toolTips = {
      history: 'Browse the history of your activites in Ninkasi',
      buildGraph: 'Build graph for all providers',
      fetchOSM: 'Fetch Open Street Map data',
      updateMapbox: 'Update mapbox data from NSR',
      cleanFileFilter: 'Clean file filter',
      canceAllJobs: 'Cancel all current chouette jobs',
      cleanAll: 'Clean all specificed by level',
      createNewProvider: 'Create new provider',
      pelias: 'Execute pelias operations',
      editProvider: 'Edit provider',
      cleanEventHistory: 'Clean event history'
    };

    const peliasPopoverStyle = {
      overflowY: 'hidden',
      padding: 10
    };

    let peliasOptions = peliasTasks.map(option =>
      <Checkbox
        key={'pelias-checkbox-' + option.task}
        label={option.label}
        onCheck={e => this.handlePeliasOptionChecked(e, option.task)}
        defaultChecked={true}
        labelPosition="right"
        style={{ marginTop: 5, marginBottom: 5 }}
      />
    );

    peliasOptions.push(
      <Divider
        key={'pelias-divider1'}
        style={{ marginTop: 10, marginBottom: 5 }}
      />
    );

    peliasOptions.push(
      <div
        key={'pelias-options-status-wrapper'}
        style={{ display: 'flex', flexDirection: 'column', padding: 5 }}
      >
        <span style={{ fontWeight: 600 }}>Status</span>
        {otherStatus.map((status, index) =>
          <div
            key={'jobtype-status' + index}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              background: index % 2 ? '#F8F8F8' : '#fff'
            }}
          >
            <div style={{ marginLeft: 5, flex: 9, fontSize: '0.9em' }}>
              {this.getLabelByJobType(status.type)}
            </div>
            <div style={{ fontSize: '0.9em', flex: 6 }}>
              {moment(status.started).format('LLLL')}
            </div>
            <div
              style={{
                marginLeft: 5,
                flex: 2,
                color: this.getColorByStatus(status.status)
              }}
            >
              {status.status}
            </div>
          </div>
        )}
      </div>
    );

    peliasOptions.push(
      <Divider
        key={'pelias-divider2'}
        style={{ marginTop: 10, marginBottom: 10 }}
      />
    );

    peliasOptions.push(
      <div
        key={'pelias-buttons'}
        style={{ width: '100%', textAlign: 'center' }}
      >
        <FlatButton
          primary={true}
          labelStyle={{ fontSize: 12 }}
          onClick={() => this.handleExecutePelias()}
          disabled={Object.values(this.state.peliasOptions).every(
            value => !value
          )}
          label={'Execute'}
        />
      </div>
    );

    return (
      <div className="suppliers-container">
        <div style={innerContainerStyle}>
          <div>
            <FlatButton
              disabled={!isAdmin}
              title={toolTips.pelias}
              labelStyle={{ fontSize: 12, color: '#fff' }}
              label={'Pelias'}
              labelPosition="before"
              onClick={event => this.handleTogglePeliasOpen(event, true)}
              icon={
                <MdDropDown
                  color="#fff"
                  style={{ verticalAlign: 'middle', marginTop: -3 }}
                />
              }
            />
            <Popover
              open={this.state.peliasOpen}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={event =>
                this.handleTogglePeliasOpen(event, false)}
              style={peliasPopoverStyle}
            >
              {peliasOptions}
            </Popover>
            <FlatButton
              disabled={!isAdmin}
              title={toolTips.buildGraph}
              labelStyle={{ fontSize: 12, color: '#fff' }}
              label={'Build Graph'}
              onClick={this.handleBuildGraph.bind(this)}
            />
            <FlatButton
              disabled={!isAdmin}
              title={toolTips.fetchOSM}
              labelStyle={{ fontSize: 12, color: '#fff' }}
              label={'Fetch OSM'}
              onClick={this.handleFetchOSM.bind(this)}
            />
            <FlatButton
                disabled={!isAdmin}
                onClick={this.handleGoogleOpen.bind(this)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                    style={{
                        fontSize: 12,
                        color: '#fff',
                        paddingLeft: 8,
                        paddingRight: 8,
                        paddingTop: 2,
                        textTransform: 'uppercase'
                    }}
                >
                  Google
                </div>
                <MdDropDown color="#fff"/>
              </div>
            </FlatButton>
          <Popover
            open={this.state.googlePopoverOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={() => this.setState({ googlePopoverOpen: false })}
          >
            <MenuItem
              primaryText={'Upload GTFS (production)'}
              style={{ fontSize: '1.1em' }}
              onClick={() => this.handleUploadGoogleProduction()}
              disabled={!isAdmin}
              title={toolTips.uploadGoogleProduction}
            />
            <MenuItem
              primaryText={'Upload GTFS (QA)'}
              style={{ fontSize: '1em' }}
              onClick={() => this.handleUploadGoogleQA()}
              disabled={!isAdmin}
              title={toolTips.uploadGoogleQA}
            />
          </Popover>
            {/*<FlatButton
              disabled={!isAdmin}
              title={toolTips.updateMapbox}
              labelStyle={{ fontSize: 12, color: '#fff' }}
              label={'Update Mapbox'}
              onClick={this.handleUpdateMapbox.bind(this)}
            />*/}
          </div>
          <div
            style={{
              borderLeft: '1px solid #4c4c4c',
              height: 15,
              margin: '10px 0'
            }}
          />
          <div>
            <FlatButton
              disabled={!isAdmin}
              onClick={this.handleCleanOpen.bind(this)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <MdWarning
                  color={iconColor}
                  style={{ height: '1.1em', width: '1.1em', paddingLeft: 10 }}
                />
                <div
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 2,
                    textTransform: 'uppercase'
                  }}
                >
                  Clean
                </div>
                <MdDropDown color="#fff"/>
              </div>
            </FlatButton>
            <FlatButton
              disabled={!isAdmin}
              title={toolTips.canceAllJobs}
              style={{transform: 'translateY(-3px)'}}
              labelStyle={{ fontSize: 12, color: '#fff' }}
              label={'Cancel all jobs'}
              icon={
                <MdWarning
                  color={iconColor}
                  style={{ height: '1.1em', width: '1.1em' }}
                />
              }
              onClick={() => this.handleCancelAllJobs()}
            />
          </div>
          <Popover
            open={this.state.cleanPopoverOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={() => this.setState({ cleanPopoverOpen: false })}
          >
            <MenuItem
              primaryText={'Clean file filter'}
              style={{ fontSize: '1.1em' }}
              onClick={() => this.handleCleanFileFilter()}
              disabled={!isAdmin}
              title={toolTips.cleanFileFilter}
            />
            <MenuItem
              primaryText={'Clean event history'}
              style={{ fontSize: '1em' }}
              onClick={() => this.handleClearEventHistory()}
              disabled={!isAdmin}
              title={toolTips.cleanEventHistory}
            />
            <MenuItem
              primaryText={'Clean Stop Places'}
              style={{ fontSize: '1em' }}
              onClick={() => this.handleClearStopPlaces()}
              disabled={!isAdmin}
              title={toolTips.cleanStopPlacesChouette}
            />
            <MenuItem
              disabled={!isAdmin}
              id="dropdown-clean-all"
              primaryText={'Clean all'}
              style={{ fontSize: '1em' }}
              rightIcon={<ArrowDropRight />}
              menuItems={[
                <MenuItem
                  primaryText={'All'}
                  onClick={() => this.handleCleanAllDataSpaces('all')}
                  style={{ fontSize: '1em' }}
                />,
                <MenuItem
                  primaryText={'Level 1'}
                  onClick={() => this.handleCleanAllDataSpaces('level1')}
                  style={{ fontSize: '1em' }}
                />,
                <MenuItem
                  primaryText={'Level 2'}
                  onClick={() => this.handleCleanAllDataSpaces('level2')}
                  style={{ fontSize: '1em' }}
                />
              ]}
            />
          </Popover>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: 'auto',
            width: '98%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SelectField
              id="select-supplier"
              floatingLabelFixed={true}
              style={{ minWidth: 350 }}
              floatingLabelText={'Provider'}
              onChange={(e, k, v) => this.selectSupplier(v)}
              autoWidth={true}
              value={Number(activeProviderId) || -1}
              iconStyle={{ fill: 'rgba(22, 82, 149, 0.69)' }}
            >
              {supplierItems.map(supplier => {
                const isLevel1Provider =
                  (supplier.chouetteInfo &&
                    supplier.chouetteInfo.migrateDataToProvider) ||
                  supplier.id == -1;
                return (
                  <MenuItem
                    key={supplier.id}
                    value={supplier.id}
                    label={supplier.name}
                    primaryText={
                      <span
                        style={{
                          color: isLevel1Provider ? 'intial' : '#d9a51b'
                        }}
                      >
                        {supplier.name}
                      </span>
                    }
                  />
                );
              })}
            </SelectField>
            <div
              style={{ display: 'inline-block', marginTop: 25, marginLeft: 15 }}
            >
              <div
                title={toolTips.editProvider}
                style={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  marginRight: 10
                }}
                onClick={() => this.handleEditProvider()}
              >
                {!this.props.displayAllSuppliers &&
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MdEdit style={{ width: '1.1em', height: '1.1em' }} />
                    <span style={{ marginLeft: 2 }}>Edit</span>
                  </div>}
              </div>
              <div
                title={toolTips.createNewProvider}
                style={{ display: 'inline-block', cursor: 'pointer' }}
                onClick={() => this.handleNewProvider()}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MdNew style={{ width: '1.2em', height: '1.2em' }} />
                  <span style={{ marginLeft: 2 }}>New</span>
                </div>
              </div>
            </div>
          </div>
          <GraphStatus />
          <ConfirmDialog
            open={this.state.confirmDialogOpen}
            handleSubmit={this.state.confirmAction}
            title={this.state.confirmTitle}
            info={this.state.confirmInfo}
            handleClose={() => {
              this.setState({
                confirmDialogOpen: false,
                confirmAction: null
              });
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  suppliers: state.SuppliersReducer.data,
  activeProviderId: state.SuppliersReducer.activeId,
  otherStatus: state.SuppliersReducer.otherStatus || [],
  kc: state.UserReducer.kc,
  displayAllSuppliers: state.SuppliersReducer.all_suppliers_selected
});

export default connect(mapStateToProps)(SuppliersContainer);
