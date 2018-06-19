import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import SuppliersActions from '../actions/SuppliersActions';
import { EventDetails } from 'bogu';
import ChouetteJobDetails from './ChouetteJobDetails';
import ChouetteAllJobs from './ChouetteAllJobs';
import DataMigrationDetails from './DataMigrationDetails';
import Loader from 'halogen/PulseLoader';
import '../sass/main.scss';
import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';
import { getQueryVariable } from './utils';
import FileUpload from './FileUpload';
import StatisticsDetails from './StatisticsDetails';
import StaticsForProvider from './StatisticsForProvider';
import OrganizationRegister from './OrganizationRegister';
import rolesParser from '../roles/rolesParser';
import ExportedFilesView from '../containers/ExportedFilesView';

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
    if (queryTab == 'events') {
      if (queryId) {
        dispatch(SuppliersActions.getProviderStatus(queryId));
      } else {
        dispatch(SuppliersActions.getAllProviderStatus());
      }
    } else if (queryTab == 'chouetteJobs') {
      if (queryId) {
        dispatch(SuppliersActions.getChouetteJobStatus());
      } else {
        dispatch(SuppliersActions.getChouetteJobsForAllSuppliers());
      }
    } else if (queryTab == 'statistics') {
      if (queryId) {
        dispatch(SuppliersActions.getLineStatsForProvider(queryId));
      } else {
        dispatch(SuppliersActions.getAllLineStats());
      }
    } else if (queryTab == 'OrganisationRegister') {
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

  onTabChangeForProvider(i, value, tab, ev) {
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
      case 'statistics':
        dispatch(SuppliersActions.getLineStatsForProvider(activeId));

      default:
        break;
    }
  }

  onTabChangeForAllProviders(i, value, tab, ev) {
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
      case 'statistics':
        this.props.dispatch(SuppliersActions.getAllLineStats());
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
      case 'uploadFiles': {
        if (displayAllSuppliers) {
          this.onTabChangeForAllProviders(0, 'chouetteJobs', null, null);
          return 0;
        } else {
          return 4;
        }
      }
      default:
        return 0;
    }
  }

  handleFileUpload(files) {
    const { dispatch, activeId } = this.props;
    dispatch(SuppliersActions.uploadFiles(files, activeId));
  }

  handleRefreshAllProviders() {
    this.props.dispatch(SuppliersActions.getAllProviderStatus());
  }

  handleRefreshActiveProvider() {
    const { dispatch, activeId } = this.props;
    dispatch(SuppliersActions.getProviderStatus(activeId));
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

  render() {
    const {
      displayAllSuppliers,
      activeId,
      suppliers,
      filelistIsLoading,
      fileUploadProgress,
      lineStats,
      canEditOrganisation
    } = this.props;

    if (filelistIsLoading) {
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
      let tabsToRender = null;

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
              <EventDetails
                handleRefresh={this.handleRefreshAllProviders.bind(this)}
                dataSource={this.props.allProvidersEvents}
                key="statusList"
                showDateFilter={true}
                locale="en"
                includeLevel2={true}
                showNewDeliveriesFilter={true}
              />
            </Tab>
            <Tab value="statistics" label="Statistics">
              {suppliers.length && (
                <StatisticsDetails
                  dispatch={this.props.dispatch}
                  lineStats={lineStats}
                  suppliers={suppliers.filter(
                    s => !!s.chouetteInfo.migrateDataToProvider
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
              <EventDetails
                handleRefresh={this.handleRefreshActiveProvider.bind(this)}
                dataSource={this.props.providerEvents}
                locale="en"
                key="statusList"
                includeLevel2={true}
                showDateFilter={true}
                showNewDeliveriesFilter={true}
              />
            </Tab>
            <Tab value="chouetteJobs" label="Chouette jobs">
              <ChouetteJobDetails />
            </Tab>
            <Tab value="statistics" label="Statistics">
              <StaticsForProvider provider={provider} />
            </Tab>
            <Tab value="uploadFiles" label="Upload file">
              <FileUpload
                fileUploadProgress={fileUploadProgress}
                handleFileUpload={this.handleFileUpload.bind(this)}
              />
            </Tab>
          </Tabs>
        );
      }

      return (
        <div className="supplier-info">
          <div style={{ marginLeft: 10, marginRight: 10 }}>{tabsToRender}</div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  suppliers: state.SuppliersReducer.data,
  activeId: state.SuppliersReducer.activeId,
  filelistIsLoading: state.MardukReducer.filenames.isLoading,
  displayAllSuppliers: state.SuppliersReducer.all_suppliers_selected,
  providerEvents: state.SuppliersReducer.statusList,
  allProvidersEvents: state.SuppliersReducer.statusListAllProviders,
  fileUploadProgress: state.SuppliersReducer.fileUploadProgress,
  lineStats: state.SuppliersReducer.lineStats,
  kc: state.UserReducer.kc,
  canEditOrganisation: rolesParser.canEditOrganisation(
    state.UserReducer.kc.tokenParsed
  )
});

export default connect(mapStateToProps)(SupplierTabWrapper);
