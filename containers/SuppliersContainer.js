import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import SuppliersActions from '../actions/SuppliersActions';
import cfgreader from '../config/readConfig';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Button from 'muicss/lib/react/button';
const FaAdd = require('react-icons/lib/fa/plus');
const FaHistory = require('react-icons/lib/fa/history');
const FaExclamation = require('react-icons/lib/fa/exclamation-triangle');
import Dropdown from 'muicss/lib/react/dropdown';
import DropdownItem from 'muicss/lib/react/dropdown-item';
import GraphStatus from '../components/GraphStatus';
import { getQueryVariable } from './utils';
import Checkbox from 'material-ui/Checkbox';
import Popover from 'material-ui/Popover';
import MdDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import Divider from 'material-ui/Divider';
import peliasTasks from '../config/peliasTasks';
import moment from 'moment';
import roleParser from '../roles/rolesParser';
import FaEdit from 'react-icons/lib/fa/pencil';


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
      }
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
    this.props.dispatch(SuppliersActions.buildGraph());
  }

  handleFetchOSM() {
    this.props.dispatch(SuppliersActions.fetchOSM());
  }

  openModal() {
    this.props.dispatch(SuppliersActions.openModalDialog());
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
    const confirmedByUser = confirm(
      'Are you want to cancel all chouette jobs for all providers?'
    );

    if (confirmedByUser) {
      this.props.dispatch(
        SuppliersActions.cancelAllChouetteJobsforAllProviders()
      );
    }
  }

  handleCleanAllDataSpaces(filter) {
    const confirmedByUser = confirm(
      `Are you sure you want to clean all dataspaces with filter ${filter}?`
    );

    if (confirmedByUser) {
      this.props.dispatch(SuppliersActions.cleanAllDataspaces(filter));
    }
  }

  handleCleanFileFilter() {
    const confirmedByUser = confirm(
      'Are you sure you want to clean file filter?'
    );

    if (confirmedByUser) {
      this.props.dispatch(SuppliersActions.cleanFileFilter());
    }
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
    const { dispatch } = this.props;
    dispatch(SuppliersActions.executePeliasTask(this.state.peliasOptions));
  }

  handleClearEventHistory() {
    const { dispatch } = this.props;
    const confirmedByUser = confirm('Are you want to clean all event history?');
    if (confirmedByUser) {
      dispatch(SuppliersActions.deleteAllJobs());
    }
  }

  handleClearStopPlaces() {
    const { dispatch } = this.props;
    const confirmedByUser = confirm(
      'Are you want to clean Stop Place Register in Chouette?'
    );
    if (confirmedByUser) {
      dispatch(SuppliersActions.cleanStopPlacesInChouette());
    }
  }

  handleEditProvider() {
    this.props.dispatch(SuppliersActions.openEditProviderDialog());
  }

  handleLogout() {
    const { kc } = this.props;
    kc.logout();
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

    let isAdmin = roleParser.isAdmin(kc.tokenParsed);
    const supplierItems = [{
      id: -1,
      name: 'All providers'
    }].concat(suppliers);

    let innerContainerStyle = {
      display: 'flex',
      background: '#2f2f2f',
      color: '#fff',
      justifyContent: 'flex-end',
      borderTop: '1px solid rgba(158, 158, 158, 0.15)'
    };

    const toolTips = {
      history: 'Browse the history of your activites in Ninkasi',
      buildGraph: 'Build graph for all providers',
      fetchOSM: 'Fetch Open Street Map data',
      cleanFileFilter: 'Clean file filter',
      canceAllJobs: 'Cancel all current chouette jobs',
      cleanAll: 'Clean all specificed by level',
      createNewProvider: 'Create new provider',
      pelias: 'Execute pelias operations',
      editProvider: 'Edit provider',
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
        labelPosition="left"
        style={{ marginTop: 5, marginBottom: 5 }}
      />
    );

    peliasOptions.push(
      <Divider
        key={'pelias-divider1'}
        style={{ marginTop: 10, marginBottom: 10 }}
      />
    );

    peliasOptions.push(
      <div
        key={'pelias-options-status-wrapper'}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <span style={{ fontWeight: 600 }}>Status</span>
        {otherStatus.map((status, index) =>
          <div
            key={'jobtype-status' + index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ marginLeft: 5, flex: '1 1' }}>
              {this.getLabelByJobType(status.type)}
            </div>
            <div
              style={{
                marginLeft: 5,
                color: this.getColorByStatus(status.status)
              }}
            >
              {status.status}
            </div>
            <div style={{ marginLeft: 5, fontSize: '0.9em' }}>
              {moment(status.started).format('HH:mm:ss DD-MM')}
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
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <Button
          color="primary"
          style={{ fontSize: 12, textAlign: 'middle', marginTop: -2 }}
          onClick={() => this.handleExecutePelias()}
          disabled={Object.values(this.state.peliasOptions).every(
            value => !value
          )}
        >
          Execute
        </Button>
      </div>
    );

    return (
      <div className="suppliers-container">
        <div style={innerContainerStyle}>
          <Button
            title={toolTips.history}
            style={{ fontSize: 12 }}
            color="dark"
            onClick={() => this.openModal()}
          >
            <FaHistory color="#fff" /> History
          </Button>
          <Button
            disabled={!isAdmin}
            title={toolTips.pelias}
            style={{ fontSize: 12 }}
            color="dark"
            onClick={event => this.handleTogglePeliasOpen(event, true)}
          >
            Pelias
            <MdDropDown color="#fff" style={{ verticalAlign: 'middle' }} />
          </Button>
          <Popover
            open={this.state.peliasOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={event => this.handleTogglePeliasOpen(event, false)}
            style={peliasPopoverStyle}
          >
            {peliasOptions}
          </Popover>
          <Button
            disabled={!isAdmin}
            title={toolTips.buildGraph}
            style={{ fontSize: 12 }}
            color="dark"
            onClick={this.handleBuildGraph.bind(this)}
          >
            Build Graph
          </Button>
          <Button
            disabled={!isAdmin}
            title={toolTips.fetchOSM}
            style={{ fontSize: 12 }}
            color="dark"
            onClick={this.handleFetchOSM.bind(this)}
          >
            Fetch OSM
          </Button>
          <Button
            disabled={!isAdmin}
            title={toolTips.cleanFileFilter}
            style={{ fontSize: 12 }}
            color="dark"
            onClick={() => this.handleCleanFileFilter()}
          >
            <FaExclamation color="#b8c500" /> Clean file filter
          </Button>
          <Button
            disabled={!isAdmin}
            title={toolTips.canceAllJobs}
            style={{ fontSize: 12 }}
            color="dark"
            onClick={() => this.handleCancelAllJobs()}
          >
            <FaExclamation color="#b8c500" /> Cancel all jobs
          </Button>
          <Button
            disabled={!isAdmin}
            title={toolTips.clearEventHistory}
            style={{ fontSize: 12 }}
            color="dark"
            onClick={() => this.handleClearEventHistory()}
          >
            <FaExclamation color="#b8c500" /> Clean event history
          </Button>
          <Button
            disabled={!isAdmin}
            title={toolTips.cleanStopPlacesChouette}
            style={{ fontSize: 12 }}
            color="dark"
            onClick={() => this.handleClearStopPlaces()}
          >
            <FaExclamation color="#b8c500" /> Clean Stop Places
          </Button>
          <Dropdown
            disabled={!isAdmin}
            title={toolTips.cleanAll}
            id="dropdown-clean-all"
            color="dark"
            label="Clean all"
          >
            <DropdownItem
              onClick={() => this.handleCleanAllDataSpaces('all')}
            />
            <DropdownItem
              onClick={() => this.handleCleanAllDataSpaces('level1')}
            >
              Level 1
            </DropdownItem>
            <DropdownItem
              onClick={() => this.handleCleanAllDataSpaces('level2')}
            >
              Level 2
            </DropdownItem>
          </Dropdown>
          <Button
            style={{ fontSize: 12 }}
            color="dark"
            onClick={this.handleLogout.bind(this)}
          >
            Log out
          </Button>
        </div>
        <div style={{display: 'flex', alignItems: 'center', margin: 'auto', width: '98%'}}>
        <SelectField
          id="select-supplier"
          floatingLabelFixed={true}
          floatingLabelText={"Provider"}
          onChange={(e, k, v) => this.selectSupplier(v)}
          autoWidth={true}
          value={Number(activeProviderId) || -1}
          iconStyle={{fill: 'rgba(22, 82, 149, 0.69)'}}
        >
          {supplierItems.map(supplier => {
            const isLevel1Provider = (supplier.chouetteInfo && supplier.chouetteInfo.migrateDataToProvider || supplier.id == -1);
            return (
              <MenuItem
                key={supplier.id}
                value={supplier.id}
                label={supplier.name}
                primaryText={
                  <span style={{
                    color: isLevel1Provider ? '#000' : '#4B4B4B',
                  }}>
                  {supplier.name}
                  </span>
                }
              />
            );
          }
          )}
        </SelectField>
          <div style={{display: 'inline-block', marginTop: 25, marginLeft: 15}}>
            <div
              title={toolTips.editProvider}
              style={{ display: 'inline-block', cursor: 'pointer', marginRight: 10 }}
              onClick={() => this.handleEditProvider()}
            >
              { !this.props.displayAllSuppliers &&
              <div style={{display: 'flex', alignItems: 'center'}}>
                <FaEdit />
                <span style={{marginLeft: 2}}>Edit</span>
              </div>
              }
            </div>
            <div
              title={toolTips.createNewProvider}
              style={{ display: 'inline-block', cursor: 'pointer' }}
              onClick={() => this.handleNewProvider()}
            >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <FaAdd />
                <span style={{marginLeft: 2}}>New</span>
              </div>
            </div>
          </div>
        </div>
        <GraphStatus />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    suppliers: state.SuppliersReducer.data,
    activeProviderId: state.SuppliersReducer.activeId,
    otherStatus: state.SuppliersReducer.otherStatus || [],
    kc: state.UserReducer.kc,
    displayAllSuppliers: state.SuppliersReducer.all_suppliers_selected,
  };
};

export default connect(mapStateToProps)(SuppliersContainer);
