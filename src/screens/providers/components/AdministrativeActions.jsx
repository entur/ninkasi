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
import withAuth from 'utils/withAuth';
import SuppliersActions from 'actions/SuppliersActions';
import cfgreader from 'config/readConfig';
import { MenuItem, Popover } from '@mui/material';
import { Warning, ArrowDropDown, KeyboardArrowRight } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { getIconColor, getProvidersEnv, getTheme } from 'config/themes';
import ConfirmDialog from '../../../modals/ConfirmDialog';
import { connect } from 'react-redux';

class AdministrativeActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      confirmDialogOpen: false,
      confirmAction: null,
      confirmTitle: '',
      confirmInfo: '',
      cleanPopoverOpen: false,
      graphPopoverOpen: false,
    };

    cfgreader.readConfig(function (config) {
      window.config = config;
    });
  }

  handleBuildGraph() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Build graph',
      confirmInfo: 'Are you sure you want to build graph?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.buildGraph());
      },
    });
  }

  handleBuildBaseGraph() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Build base graph',
      confirmInfo: 'Are you sure you want to build base graph?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.buildBaseGraph());
      },
    });
  }

  handleBuildCandidateGraphOTP() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Build candidate graph (OTP)',
      confirmInfo: 'Are you sure you want to build candidate graph (OTP)?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.buildCandidateGraphOTP());
      },
    });
  }

  handleBuildCandidateBaseGraphOTP() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Build candidate base graph (OTP)',
      confirmInfo: 'Are you sure you want to build candidate base graph (OTP)?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.buildCandidateBaseGraphOTP());
      },
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
      },
    });
  }

  handleCancelAllJobs() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Cancel all chouette jobs',
      confirmInfo: 'Are you want to cancel all chouette jobs for all providers?',
      confirmAction: () => {
        const { dispatch, getToken } = this.props;
        dispatch(SuppliersActions.cancelAllChouetteJobsforAllProviders(getToken));
      },
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
      cleanPopoverOpen: false,
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
      cleanPopoverOpen: false,
    });
  }

  handleClearEventHistory() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Clean All Event History',
      confirmInfo: 'Are you want to clean all event history?',
      confirmAction: () => {
        const { dispatch, getToken } = this.props;
        dispatch(SuppliersActions.deleteAllJobs(getToken));
      },
      cleanPopoverOpen: false,
    });
  }

  handleClearStopPlaces() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Clean Stop Placee Register in Chouette',
      confirmInfo: 'Are you want to clean Stop Place Register in Chouette?',
      confirmAction: () => {
        const { dispatch, getToken } = this.props;
        dispatch(SuppliersActions.cleanStopPlacesInChouette(getToken));
      },
      cleanPopoverOpen: false,
    });
  }

  handleGraphOpen(event) {
    event.preventDefault();

    this.setState({
      graphPopoverOpen: true,
      anchorEl: event.currentTarget,
    });
  }

  handleCleanOpen(event) {
    event.preventDefault();

    this.setState({
      cleanPopoverOpen: true,
      anchorEl: event.currentTarget,
    });
  }

  render() {
    const providersEnv = getProvidersEnv(window.config.providersBaseUrl);
    const iconColor = getIconColor(providersEnv);

    const innerContainerStyle = {
      display: 'flex',
      justifyContent: 'center',
      borderTop: '1px solid rgba(158, 158, 158, 0.15)',
      ...getTheme(providersEnv),
    };

    const toolTips = {
      buildGraph: 'Build graph for all providers',
      buildBaseGraph: 'Build new base graph with OSM and elevation data',
      buildCandidateGraph: 'Build candidate graph for all providers (OTP)',
      buildCandidateBaseGraphOTP:
        'Build new candidate base graph with OSM and elevation data (OTP)',
      fetchOSM: 'Fetch Open Street Map data',
      cleanFileFilter: 'Clean file filter',
      canceAllJobs: 'Cancel all current chouette jobs',
      cleanEventHistory: 'Clean event history',
    };

    return (
      <div style={innerContainerStyle}>
        <div>
          <Button variant="text" onClick={this.handleGraphOpen.bind(this)}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: 12,
                  color: '#fff',
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 2,
                  textTransform: 'uppercase',
                }}
              >
                Graph
              </div>
              <ArrowDropDown sx={{ color: 'white' }} />
            </div>
          </Button>
          <Popover
            open={this.state.graphPopoverOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            onClose={() => this.setState({ graphPopoverOpen: false })}
          >
            <MenuItem
              style={{ fontSize: '1.1em' }}
              onClick={() => this.handleBuildGraph()}
              title={toolTips.buildGraph}
            >
              Build graph
            </MenuItem>
            <MenuItem
              style={{ fontSize: '1em' }}
              onClick={() => this.handleBuildBaseGraph()}
              title={toolTips.buildBaseGraph}
            >
              Build base graph
            </MenuItem>
            <MenuItem
              style={{ fontSize: '1em' }}
              onClick={() => this.handleBuildCandidateGraphOTP()}
              title={toolTips.buildCandidateGraphOTP}
            >
              Build Candidate Graph OTP
            </MenuItem>
            <MenuItem
              style={{ fontSize: '1em' }}
              onClick={() => this.handleBuildCandidateBaseGraphOTP()}
              title={toolTips.buildCandidateBaseGraphOTP}
            >
              Build Candidate Base Graph OTP
            </MenuItem>
          </Popover>
          <Button
            variant="text"
            title={toolTips.fetchOSM}
            style={{ fontSize: 12, color: '#fff' }}
            onClick={this.handleFetchOSM.bind(this)}
          >
            Fetch OSM
          </Button>
        </div>
        <div
          style={{
            borderLeft: '1px solid #4c4c4c',
            height: 15,
            margin: '10px 0',
          }}
        />
        <div>
          <Button variant="text" onClick={this.handleCleanOpen.bind(this)}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Warning
                sx={{
                  color: 'white',
                  height: '1.1em',
                  width: '1.1em',
                  paddingLeft: '10px',
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  color: '#fff',
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 2,
                  textTransform: 'uppercase',
                }}
              >
                Clean
              </div>
              <ArrowDropDown sx={{ color: 'white' }} />
            </div>
          </Button>
          <Button
            variant="text"
            title={toolTips.canceAllJobs}
            onClick={() => this.handleCancelAllJobs()}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Warning
                sx={{
                  color: 'white',
                  height: '1.1em',
                  width: '1.1em',
                  paddingLeft: '10px',
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  color: '#fff',
                  marginLeft: '0.5rem',
                }}
              >
                Cancel all jobs
              </div>
            </div>
          </Button>
        </div>
        <Popover
          open={this.state.cleanPopoverOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          onClose={() => this.setState({ cleanPopoverOpen: false })}
        >
          <MenuItem
            style={{ fontSize: '1.1em' }}
            onClick={() => this.handleCleanFileFilter()}
            title={toolTips.cleanFileFilter}
          >
            Clean file filter
          </MenuItem>
          <MenuItem
            style={{ fontSize: '1em' }}
            onClick={() => this.handleClearEventHistory()}
            title={toolTips.cleanEventHistory}
          >
            Clean event history
          </MenuItem>
          <MenuItem
            style={{ fontSize: '1em' }}
            onClick={() => this.handleClearStopPlaces()}
            title={toolTips.cleanStopPlacesChouette}
          >
            Clean Stop Places
          </MenuItem>
          <MenuItem
            id="dropdown-clean-all"
            style={{ fontSize: '1em' }}
            onClick={() => this.handleCleanAllDataSpaces('all')}
          >
            <KeyboardArrowRight style={{ marginRight: 8 }} />
            Clean all
          </MenuItem>
          <MenuItem
            style={{ fontSize: '1em', paddingLeft: '2em' }}
            onClick={() => this.handleCleanAllDataSpaces('level1')}
          >
            Clean Level 1
          </MenuItem>
          <MenuItem
            style={{ fontSize: '1em', paddingLeft: '2em' }}
            onClick={() => this.handleCleanAllDataSpaces('level2')}
          >
            Clean Level 2
          </MenuItem>
        </Popover>
        <ConfirmDialog
          open={this.state.confirmDialogOpen}
          handleSubmit={this.state.confirmAction}
          title={this.state.confirmTitle}
          info={this.state.confirmInfo}
          handleClose={() => {
            this.setState({
              confirmDialogOpen: false,
              confirmAction: null,
            });
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(withAuth(AdministrativeActions));
