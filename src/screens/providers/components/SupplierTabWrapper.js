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
import SuppliersActions from 'actions/SuppliersActions';
import ChouetteJobDetails from './ChouetteJobDetails';
import ChouetteAllJobs from './ChouetteAllJobs';
import DataMigrationDetails from './DataMigrationDetails';
import { PulseLoader as Loader } from 'halogenium';
import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';
import { getQueryVariable } from 'utils';
import OrganizationRegister from './OrganizationRegister';
import ExportedFilesView from './ExportedFilesView';
import { MicroFrontend } from '@entur/micro-frontend';
import { MicroFrontendFetchStatus } from '../../../app/components/MicroFrontendFetchStatus';

class SupplierTabWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabForProvider: getQueryVariable('tab') || 'migrateData',
      activeTabForAllProvider: getQueryVariable('tab') || 'chouetteJobs'
    };
  }

  componentDidMount() {
    const queryTab = getQueryVariable('tab');
    const queryId = getQueryVariable('id');

    const { dispatch } = this.props;
    if (queryTab === 'events') {
      if (queryId) {
        dispatch(SuppliersActions.getProviderStatus(queryId));
      } else {
        dispatch(SuppliersActions.getAllProviderStatus());
      }
    } else if (queryTab === 'chouetteJobs') {
      if (queryId) {
        dispatch(SuppliersActions.getChouetteJobStatus());
      } else {
        dispatch(SuppliersActions.getChouetteJobsForAllSuppliers());
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
    const { dispatch, activeId, displayAllSuppliers } = this.props;
    const { activeTabForProvider, activeTabForAllProvider } = this.state;
    const queryTab = getQueryVariable('tab');

    if (
      !displayAllSuppliers &&
      activeTabForProvider === 'chouetteJobs' &&
      activeId
    ) {
      dispatch(SuppliersActions.getChouetteJobStatus());
    }

    if (displayAllSuppliers && queryTab === 'exportedFiles') {
      dispatch(SuppliersActions.getExportedFiles());
    }

    if (displayAllSuppliers && activeTabForAllProvider === 'chouetteJobs') {
      dispatch(SuppliersActions.getChouetteJobsForAllSuppliers());
    }
  };

  onTabChangeForProvider(i, value) {
    if (typeof value === 'object') return;
    const { dispatch, activeId } = this.props;

    if (value) {
      window.history.pushState(
        window.config.endpointBase,
        'Title',
        `?id=${activeId}&tab=${value}`
      );
    }

    switch (value) {
      case 'chouetteJobs':
        dispatch(SuppliersActions.getChouetteJobStatus());
        break;
      case 'events':
        dispatch(SuppliersActions.getProviderStatus(activeId));
        break;
      default:
        break;
    }
  }

  onTabChangeForAllProviders(i, value) {
    if (typeof value === 'object') return;

    if (value) {
      window.history.pushState(
        window.config.endpointBase,
        'Title',
        `?tab=${value}`
      );
    }
    switch (value) {
      case 'chouetteJobs':
        this.props.dispatch(SuppliersActions.getChouetteJobsForAllSuppliers());
        break;
      case 'events':
        this.props.dispatch(SuppliersActions.getAllProviderStatus());
        break;
      default:
        break;
    }
  }

  getTabIndexFromParams() {
    const { displayAllSuppliers } = this.props;
    let param = getQueryVariable('tab');
    switch (param) {
      case 'events':
        return displayAllSuppliers ? 1 : 1;
      case 'chouetteJobs':
        return displayAllSuppliers ? 0 : 2;
      case 'migrateData': {
        if (displayAllSuppliers) {
          this.onTabChangeForAllProviders(0, 'chouetteJobs', null, null);
        }
        return 0;
      }
      case 'statistics':
        return displayAllSuppliers ? 2 : 3;
      case 'exportedFiles':
        if (displayAllSuppliers) {
          return 3;
        } else {
          this.onTabChangeForAllProviders(0, 'migrateData', null, null);
          return 0;
        }
      case 'organisationRegister':
        if (displayAllSuppliers) {
          return 4;
        } else {
          this.onTabChangeForAllProviders(0, 'migrateData', null, null);
          return 0;
        }
      default:
        return 0;
    }
  }

  componentDidUpdate() {
    const tabIndexFromParams = this.getTabIndexFromParams();
    const { allProvidersTabs } = this.refs;
    if (
      allProvidersTabs &&
      allProvidersTabs.state &&
      allProvidersTabs.state.currentSelectedIndex !== tabIndexFromParams
    ) {
      allProvidersTabs.setState({
        currentSelectedIndex: tabIndexFromParams
      });
    }
  }

  notifyLineStatisticsLoadingFailure() {
    const { dispatch } = this.props;
    dispatch(
      SuppliersActions.addNotification(
        'Error loading micro frontend for line statistics',
        'error'
      )
    );
  }

  render() {
    const {
      displayAllSuppliers,
      activeId,
      suppliers,
      fileListIsLoading,
      auth,
      canEditOrganisation
    } = this.props;

    if (fileListIsLoading) {
      return (
        <div className="supplier-details disabled">
          <div className="supplier-header">
            <Loader color="#39a1f4" size="16px" margin="40px" />
          </div>
        </div>
      );
    }

    const provider =
      !displayAllSuppliers && suppliers.length
        ? suppliers.find(s => s.id === activeId)
        : null;
    const defaultSelectedIndex = this.getTabIndexFromParams();

    if (displayAllSuppliers || provider) {
      let tabsToRender;

      if (displayAllSuppliers) {
        tabsToRender = (
          <Tabs
            justified={true}
            onChange={this.onTabChangeForAllProviders.bind(this)}
            defaultSelectedIndex={defaultSelectedIndex}
            ref="allProvidersTabs"
          >
            <Tab value="chouetteJobs" label="Chouette jobs">
              <ChouetteAllJobs />
            </Tab>
            <Tab value="events" label="Events">
              {window.config.zagmukMicroFrontendUrl && (
                <MicroFrontend
                  id="ror-zagmuk"
                  host={window.config.zagmukMicroFrontendUrl}
                  staticPath=""
                  name="Events"
                  payload={{
                    getToken: auth.getAccessToken,
                    locale: 'en',
                    env: window.config.appEnv,
                    hideIgnoredExportNetexBlocks: true,
                    hideAntuValidationSteps: false,
                    hideFlexDataImport: false,
                    navigate: url => {
                      window.history.pushState(null, null, url);
                      window.location.reload();
                    }
                  }}
                  FetchStatus={props => (
                    <MicroFrontendFetchStatus
                      {...props}
                      label="Error loading events"
                    />
                  )}
                  handleError={error => console.log(error)}
                />
              )}
            </Tab>
            <Tab value="statistics" label="Statistics">
              {window.config.ninsarMicroFrontendUrl && (
                <MicroFrontend
                  id="ror-ninsar"
                  host={window.config.ninsarMicroFrontendUrl}
                  staticPath=""
                  name="Line statistics"
                  payload={{
                    getToken: auth.getAccessToken
                  }}
                  FetchStatus={props => (
                    <MicroFrontendFetchStatus
                      {...props}
                      label="Error loading line statistics"
                    />
                  )}
                  handleError={this.notifyLineStatisticsLoadingFailure.bind(
                    this
                  )}
                />
              )}
            </Tab>
            <Tab value="exportedFiles" label="Exported files">
              <ExportedFilesView />
            </Tab>
            {canEditOrganisation ? (
              <Tab value="organisationRegister" label="Organisation register">
                <OrganizationRegister />
              </Tab>
            ) : null}
          </Tabs>
        );
      } else {
        tabsToRender = (
          <Tabs
            justified={true}
            onChange={this.onTabChangeForProvider.bind(this)}
            defaultSelectedIndex={defaultSelectedIndex}
          >
            <Tab value="migrateData" label="Migrate data">
              <DataMigrationDetails />
            </Tab>
            <Tab value="events" label="Events">
              {window.config.zagmukMicroFrontendUrl && (
                <MicroFrontend
                  id="ror-zagmuk"
                  host={window.config.zagmukMicroFrontendUrl}
                  staticPath=""
                  name="Events"
                  payload={{
                    providerId: `${provider.id}`,
                    getToken: auth.getAccessToken,
                    locale: 'en',
                    env: window.config.appEnv,
                    hideIgnoredExportNetexBlocks: true,
                    hideAntuValidationSteps: false,
                    hideFlexDataImport: false,
                    navigate: url => {
                      window.history.pushState(null, null, url);
                      window.location.reload();
                    }
                  }}
                  FetchStatus={props => (
                    <MicroFrontendFetchStatus
                      {...props}
                      label="Error loading events"
                    />
                  )}
                  handleError={error => console.log(error)}
                />
              )}
            </Tab>
            <Tab value="chouetteJobs" label="Chouette jobs">
              <ChouetteJobDetails />
            </Tab>
            <Tab value="statistics" label="Statistics">
              {window.config.ninsarMicroFrontendUrl && (
                <MicroFrontend
                  id="ror-ninsar"
                  host={window.config.ninsarMicroFrontendUrl}
                  staticPath=""
                  name="Line statistics"
                  payload={{
                    providerId: `${provider.id}`,
                    getToken: auth.getAccessToken
                  }}
                  FetchStatus={props => (
                    <MicroFrontendFetchStatus
                      {...props}
                      label="Error loading line statistics"
                    />
                  )}
                  handleError={this.notifyLineStatisticsLoadingFailure.bind(
                    this
                  )}
                />
              )}
            </Tab>
          </Tabs>
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
  auth: state.UserReducer.auth,
  canEditOrganisation: state.UserContextReducer.isOrganisationAdmin
});

export default connect(mapStateToProps)(SupplierTabWrapper);
