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
import { connect } from 'react-redux';
import withAuth from 'utils/withAuth';
import SuppliersActions from 'actions/SuppliersActions';
import ChouetteJobDetails from './ChouetteJobDetails';
import ChouetteAllJobs from './ChouetteAllJobs';
import DataMigrationDetails from './DataMigrationDetails';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import { getQueryVariable } from 'utils';
import ExportedFilesView from './ExportedFilesView';
import { MicroFrontend } from '@entur/micro-frontend';
import { MicroFrontendFetchStatus } from '../../../app/components/MicroFrontendFetchStatus';

class SupplierTabWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabForProvider: getQueryVariable('tab') || 'migrateData',
      activeTabForAllProvider: getQueryVariable('tab') || 'chouetteJobs',
      currentTabIndex: 0,
    };
  }

  componentDidMount() {
    const queryTab = getQueryVariable('tab');
    const queryId = getQueryVariable('id');
    const tabIndex = this.getTabIndexFromParams();
    this.setState({ currentTabIndex: tabIndex });

    const { dispatch } = this.props;
    if (queryTab === 'events') {
      if (queryId) {
        dispatch(SuppliersActions.getProviderStatus(queryId, this.props.getToken));
      } else {
        dispatch(SuppliersActions.getAllProviderStatus(this.props.getToken));
      }
    } else if (queryTab === 'chouetteJobs') {
      if (queryId) {
        dispatch(SuppliersActions.getChouetteJobStatus(this.props.getToken));
      } else {
        dispatch(SuppliersActions.getChouetteJobsForAllSuppliers(this.props.getToken));
      }
    } else if (queryTab === 'OrganisationRegister') {
      if (queryId) {
        this.onTabChangeForProvider(0, 'migrateData', null, null);
      }
    } else if (queryId === 'exportedFiles') {
      if (queryId) {
        this.onTabChangeForProvider(0, 'migrateData', null, null);
      }
    }
  }

  componentWillMount() {
    this.startPolling();
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  startPolling = () => {
    setTimeout(() => {
      this._timer = setInterval(this.poll, 10000);
    }, 1000);
  };

  poll = () => {
    const { dispatch, activeId, displayAllSuppliers, getToken } = this.props;
    const { activeTabForProvider, activeTabForAllProvider } = this.state;
    const queryTab = getQueryVariable('tab');

    if (!displayAllSuppliers && activeTabForProvider === 'chouetteJobs' && activeId) {
      dispatch(SuppliersActions.getChouetteJobStatus(getToken));
    }

    if (displayAllSuppliers && queryTab === 'exportedFiles') {
      dispatch(SuppliersActions.getExportedFiles(getToken));
    }

    if (displayAllSuppliers && activeTabForAllProvider === 'chouetteJobs') {
      dispatch(SuppliersActions.getChouetteJobsForAllSuppliers(getToken));
    }
  };

  onTabChangeForProvider = (event, newValue) => {
    if (typeof newValue === 'object') return;
    const { dispatch, activeId } = this.props;

    // Find the tab index based on the value
    const tabIndex = this.getTabIndexForValue(newValue, false);
    this.setState({
      currentTabIndex: tabIndex,
      activeTabForProvider: newValue,
    });

    if (newValue) {
      window.history.pushState(
        window.config.endpointBase,
        'Title',
        `?id=${activeId}&tab=${newValue}`
      );
    }

    switch (newValue) {
      case 'chouetteJobs':
        dispatch(SuppliersActions.getChouetteJobStatus(this.props.getToken));
        break;
      case 'events':
        dispatch(SuppliersActions.getProviderStatus(activeId, this.props.getToken));
        break;
      default:
        break;
    }
  };

  onTabChangeForAllProviders = (event, newValue) => {
    if (typeof newValue === 'object') return;

    // Find the tab index based on the value
    const tabIndex = this.getTabIndexForValue(newValue, true);
    this.setState({
      currentTabIndex: tabIndex,
      activeTabForAllProvider: newValue,
    });

    if (newValue) {
      window.history.pushState(window.config.endpointBase, 'Title', `?tab=${newValue}`);
    }
    switch (newValue) {
      case 'chouetteJobs':
        this.props.dispatch(SuppliersActions.getChouetteJobsForAllSuppliers(this.props.getToken));
        break;
      case 'events':
        this.props.dispatch(SuppliersActions.getAllProviderStatus(this.props.getToken));
        break;
      default:
        break;
    }
  };

  getTabIndexFromParams() {
    const { displayAllSuppliers } = this.props;
    const param = getQueryVariable('tab');
    switch (param) {
      case 'events':
        return displayAllSuppliers ? 1 : 1;
      case 'chouetteJobs':
        return displayAllSuppliers ? 0 : 2;
      case 'migrateData': {
        if (displayAllSuppliers) {
          // For MUI tabs, we need to call with event and value
          this.onTabChangeForAllProviders(null, 'chouetteJobs');
        }
        return 0;
      }
      case 'statistics':
        return displayAllSuppliers ? 2 : 3;
      case 'exportedFiles':
        if (displayAllSuppliers) {
          return 3;
        } else {
          this.onTabChangeForAllProviders(null, 'migrateData');
          return 0;
        }
      default:
        return 0;
    }
  }

  getTabIndexForValue(value, isAllProviders) {
    if (isAllProviders) {
      switch (value) {
        case 'chouetteJobs':
          return 0;
        case 'events':
          return 1;
        case 'statistics':
          return 2;
        case 'exportedFiles':
          return 3;
        default:
          return 0;
      }
    } else {
      switch (value) {
        case 'migrateData':
          return 0;
        case 'events':
          return 1;
        case 'chouetteJobs':
          return 2;
        case 'statistics':
          return 3;
        default:
          return 0;
      }
    }
  }

  getTabValueFromIndex(index, isAllProviders) {
    if (isAllProviders) {
      const values = ['chouetteJobs', 'events', 'statistics', 'exportedFiles'];
      return values[index] || 'chouetteJobs';
    } else {
      const values = ['migrateData', 'events', 'chouetteJobs', 'statistics'];
      return values[index] || 'migrateData';
    }
  }

  componentDidUpdate(prevProps) {
    const tabIndexFromParams = this.getTabIndexFromParams();

    // Update currentTabIndex when activeId changes
    if (prevProps.activeId !== this.props.activeId) {
      this.setState({ currentTabIndex: tabIndexFromParams });

      // If on chouette jobs tab, fetch the data for the new provider
      const queryTab = getQueryVariable('tab');
      if (queryTab === 'chouetteJobs' && this.props.activeId) {
        this.props.dispatch(SuppliersActions.getChouetteJobStatus(this.props.getToken));
      }
    }

    // Update tab state if params changed (for MUI tabs we manage state internally)
    if (this.state.currentTabIndex !== tabIndexFromParams) {
      this.setState({ currentTabIndex: tabIndexFromParams });
    }
  }

  notifyLineStatisticsLoadingFailure() {
    const { dispatch } = this.props;
    dispatch(
      SuppliersActions.addNotification('Error loading micro frontend for line statistics', 'error')
    );
  }

  render() {
    const {
      displayAllSuppliers,
      activeId,
      suppliers,
      fileListIsLoading,
      getToken,
      canEditOrganisation,
    } = this.props;

    if (fileListIsLoading) {
      return (
        <div className="supplier-details disabled">
          <div className="supplier-header">
            <CircularProgress size={16} sx={{ color: '#39a1f4', margin: '40px' }} />
          </div>
        </div>
      );
    }

    const provider =
      !displayAllSuppliers && suppliers.length ? suppliers.find(s => s.id === activeId) : null;
    const defaultSelectedIndex = this.getTabIndexFromParams();

    if (displayAllSuppliers || provider) {
      let tabsToRender;

      if (displayAllSuppliers) {
        const { currentTabIndex, activeTabForAllProvider } = this.state;
        const currentValue = this.getTabValueFromIndex(currentTabIndex, true);
        tabsToRender = (
          <Box>
            <Tabs
              value={currentValue}
              onChange={this.onTabChangeForAllProviders}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab value="chouetteJobs" label="Chouette jobs" />
              <Tab value="events" label="Events" />
              <Tab value="statistics" label="Statistics" />
              <Tab value="exportedFiles" label="Exported files" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {currentTabIndex === 0 && <ChouetteAllJobs />}
              {currentTabIndex === 1 && window.config.zagmukMicroFrontendUrl && (
                <MicroFrontend
                  id="ror-zagmuk"
                  host={window.config.zagmukMicroFrontendUrl}
                  staticPath=""
                  name="Events"
                  payload={{
                    getToken,
                    locale: 'en',
                    env: window.config.appEnv,
                    hideIgnoredExportNetexBlocks: true,
                    hideAntuValidationSteps: false,
                    hideFlexDataImport: false,
                    navigate: url => {
                      window.history.pushState(null, null, url);
                      window.location.reload();
                    },
                  }}
                  FetchStatus={props => (
                    <MicroFrontendFetchStatus {...props} label="Error loading events" />
                  )}
                  handleError={error => console.log(error)}
                />
              )}
              {currentTabIndex === 2 && window.config.ninsarMicroFrontendUrl && (
                <MicroFrontend
                  id="ror-ninsar"
                  host={window.config.ninsarMicroFrontendUrl}
                  staticPath=""
                  name="Line statistics"
                  payload={{
                    getToken,
                  }}
                  FetchStatus={props => (
                    <MicroFrontendFetchStatus {...props} label="Error loading line statistics" />
                  )}
                  handleError={this.notifyLineStatisticsLoadingFailure.bind(this)}
                />
              )}
              {currentTabIndex === 3 && <ExportedFilesView />}
            </Box>
          </Box>
        );
      } else {
        const { currentTabIndex } = this.state;
        const currentValue = this.getTabValueFromIndex(currentTabIndex, false);
        tabsToRender = (
          <Box>
            <Tabs
              value={currentValue}
              onChange={this.onTabChangeForProvider}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab value="migrateData" label="Migrate data" />
              <Tab value="events" label="Events" />
              <Tab value="chouetteJobs" label="Chouette jobs" />
              <Tab value="statistics" label="Statistics" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {currentTabIndex === 0 && <DataMigrationDetails />}
              {currentTabIndex === 1 && window.config.zagmukMicroFrontendUrl && (
                <MicroFrontend
                  id="ror-zagmuk"
                  host={window.config.zagmukMicroFrontendUrl}
                  staticPath=""
                  name="Events"
                  payload={{
                    providerId: `${provider.id}`,
                    getToken,
                    locale: 'en',
                    env: window.config.appEnv,
                    hideIgnoredExportNetexBlocks: true,
                    hideAntuValidationSteps: false,
                    hideFlexDataImport: false,
                    navigate: url => {
                      window.history.pushState(null, null, url);
                      window.location.reload();
                    },
                  }}
                  FetchStatus={props => (
                    <MicroFrontendFetchStatus {...props} label="Error loading events" />
                  )}
                  handleError={error => console.log(error)}
                />
              )}
              {currentTabIndex === 2 && <ChouetteJobDetails getToken={this.props.getToken} />}
              {currentTabIndex === 3 && window.config.ninsarMicroFrontendUrl && (
                <MicroFrontend
                  id="ror-ninsar"
                  host={window.config.ninsarMicroFrontendUrl}
                  staticPath=""
                  name="Line statistics"
                  payload={{
                    providerId: `${provider.id}`,
                    getToken,
                  }}
                  FetchStatus={props => (
                    <MicroFrontendFetchStatus {...props} label="Error loading line statistics" />
                  )}
                  handleError={this.notifyLineStatisticsLoadingFailure.bind(this)}
                />
              )}
            </Box>
          </Box>
        );
      }

      return <div className="supplier-info">{tabsToRender}</div>;
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  suppliers: state.SuppliersReducer.data,
  activeId: state.SuppliersReducer.activeId,
  fileListIsLoading: state.MardukReducer.filenames.isLoading,
  displayAllSuppliers: state.SuppliersReducer.all_suppliers_selected,
  providerEvents: state.SuppliersReducer.statusList,
  allProvidersEvents: state.SuppliersReducer.statusListAllProviders,
  canEditOrganisation: state.UserContextReducer.isOrganisationAdmin,
});

export default connect(mapStateToProps)(withAuth(SupplierTabWrapper));
