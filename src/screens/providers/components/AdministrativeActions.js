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
import SuppliersActions from 'actions/SuppliersActions';
import cfgreader from 'config/readConfig';
import MenuItem from 'material-ui/MenuItem';
import MdWarning from 'material-ui/svg-icons/alert/warning';
import Popover from 'material-ui/Popover';
import MdDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import FlatButton from 'material-ui/FlatButton';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import { getIconColor, getProvidersEnv, getTheme } from 'config/themes';

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
      googlePopoverOpen: false,
      graphPopoverOpen: false
    };

    cfgreader.readConfig(function(config) {
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
      }
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
      }
    });
  }

  handleBuildCandidateGraphOTP2() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Build candidate graph (OTP2)',
      confirmInfo: 'Are you sure you want to build candidate graph (OTP2)?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.buildCandidateGraphOTP2());
      }
    });
  }

  handleBuildCandidateBaseGraphOTP2() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Build candidate base graph (OTP2)',
      confirmInfo:
        'Are you sure you want to build candidate base graph (OTP2)?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.buildCandidateBaseGraphOTP2());
      }
    });
  }

  handlePromoteCandidateBaseGraphOTP2() {
    this.setState({
      confirmDialogOpen: true,
      confirmTitle: 'Promote candidate base graph (OTP2)',
      confirmInfo:
        'Are you sure you want to promote the candidate base graph (OTP2)?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.promoteCandidateBaseGraphOTP2());
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
      confirmInfo:
        'Are you sure you want to upload latest GTFS export to Google (production)?',
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
      confirmInfo:
        'Are you sure you want to upload latest GTFS export to Google (QA)?',
      confirmAction: () => {
        const { dispatch } = this.props;
        dispatch(SuppliersActions.uploadGoogleQA());
      }
    });
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

  handleGraphOpen(event) {
    event.preventDefault();

    this.setState({
      graphPopoverOpen: true,
      anchorEl: event.currentTarget
    });
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

  render() {
    const providersEnv = getProvidersEnv(window.config.providersBaseUrl);
    const iconColor = getIconColor(providersEnv);

    const innerContainerStyle = {
      display: 'flex',
      justifyContent: 'center',
      borderTop: '1px solid rgba(158, 158, 158, 0.15)',
      ...getTheme(providersEnv)
    };

    const toolTips = {
      buildGraph: 'Build graph for all providers',
      buildBaseGraph: 'Build new base graph with OSM and elevation data',
      buildCandidateGraph: 'Build candidate graph for all providers (OTP2)',
      buildCandidateBaseGraphOTP2:
        'Build new candidate base graph with OSM and elevation data (OTP2)',
      promoteCandidateBaseGraphOTP2:
        'Build new candidate base graph with OSM and elevation data (OTP2)',
      fetchOSM: 'Fetch Open Street Map data',
      cleanFileFilter: 'Clean file filter',
      canceAllJobs: 'Cancel all current chouette jobs',
      cleanEventHistory: 'Clean event history'
    };

    return (
      <div style={innerContainerStyle}>
        <div>
          <FlatButton onClick={this.handleGraphOpen.bind(this)}>
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
                Graph
              </div>
              <MdDropDown color="#fff" />
            </div>
          </FlatButton>
          <Popover
            open={this.state.graphPopoverOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={() => this.setState({ graphPopoverOpen: false })}
          >
            <MenuItem
              primaryText={'Build graph'}
              style={{ fontSize: '1.1em' }}
              onClick={() => this.handleBuildGraph()}
              title={toolTips.buildGraph}
            />
            <MenuItem
              primaryText={'Build base graph'}
              style={{ fontSize: '1em' }}
              onClick={() => this.handleBuildBaseGraph()}
              title={toolTips.buildBaseGraph}
            />
            <MenuItem
              primaryText={'Build Candidate Graph OTP2'}
              style={{ fontSize: '1em' }}
              onClick={() => this.handleBuildCandidateGraphOTP2()}
              title={toolTips.buildCandidateGraphOTP2}
            />
            <MenuItem
              primaryText={'Build Candidate Base Graph OTP2'}
              style={{ fontSize: '1em' }}
              onClick={() => this.handleBuildCandidateBaseGraphOTP2()}
              title={toolTips.buildCandidateBaseGraphOTP2}
            />
            <MenuItem
              primaryText={'Promote Candidate Base Graph OTP2'}
              style={{ fontSize: '1em' }}
              onClick={() => this.handlePromoteCandidateBaseGraphOTP2()}
              title={toolTips.promoteCandidateBaseGraphOTP2}
            />
          </Popover>
          <FlatButton
            title={toolTips.fetchOSM}
            labelStyle={{ fontSize: 12, color: '#fff' }}
            label={'Fetch OSM'}
            onClick={this.handleFetchOSM.bind(this)}
          />
          <FlatButton onClick={this.handleGoogleOpen.bind(this)}>
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
              <MdDropDown color="#fff" />
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
              title={toolTips.uploadGoogleProduction}
            />
            <MenuItem
              primaryText={'Upload GTFS (QA)'}
              style={{ fontSize: '1em' }}
              onClick={() => this.handleUploadGoogleQA()}
              title={toolTips.uploadGoogleQA}
            />
          </Popover>
        </div>
        <div
          style={{
            borderLeft: '1px solid #4c4c4c',
            height: 15,
            margin: '10px 0'
          }}
        />
        <div>
          <FlatButton onClick={this.handleCleanOpen.bind(this)}>
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
              <MdDropDown color="#fff" />
            </div>
          </FlatButton>
          <FlatButton
            title={toolTips.canceAllJobs}
            style={{ transform: 'translateY(-3px)' }}
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
            title={toolTips.cleanFileFilter}
          />
          <MenuItem
            primaryText={'Clean event history'}
            style={{ fontSize: '1em' }}
            onClick={() => this.handleClearEventHistory()}
            title={toolTips.cleanEventHistory}
          />
          <MenuItem
            primaryText={'Clean Stop Places'}
            style={{ fontSize: '1em' }}
            onClick={() => this.handleClearStopPlaces()}
            title={toolTips.cleanStopPlacesChouette}
          />
          <MenuItem
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
    );
  }
}
export default AdministrativeActions;
