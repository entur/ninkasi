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

class SupplierTabWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabForProvider: 'migrateData',
      activeTabForAllProvider: 'chouetteJobs'
    };
  }

  componentDidMount() {

    let queryTab = getQueryVariable('tab');
    let queryId = getQueryVariable('id');

    const { dispatch } = this.props;

    if (!!queryId) {

      if (queryTab == 1) {
        dispatch(SuppliersActions.getProviderStatus(queryId));
      } else if (queryTab == 2) {
        dispatch(SuppliersActions.getChouetteJobStatus());
      } else if (queryId == 3) {
        dispatch(SuppliersActions.getLineStatsForProvider(queryId));
      }
    } else {

      if (queryTab == 0) {
        dispatch(SuppliersActions.getChouetteJobsForAllSuppliers());
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

    if (
      !displayAllSuppliers &&
      activeTabForProvider === 'chouetteJobs' &&
      activeId
    ) {
      dispatch(SuppliersActions.getChouetteJobStatus());
    }

    if (
      !displayAllSuppliers &&
      activeTabForProvider === 'statistics' &&
      activeId
    ) {
      dispatch(SuppliersActions.getLineStatsForProvider(activeId));
    }

    if (displayAllSuppliers && activeTabForAllProvider === 'chouetteJobs') {
      dispatch(SuppliersActions.getChouetteJobsForAllSuppliers());
    }
  };

  onTabChangeForProvider(i, value, tab, ev) {
    const { dispatch, activeId } = this.props;

    if (!isNaN(i)) {
      window.history.pushState(
        window.config.endpointBase,
        'Title',
        `?id=${activeId}&tab=${i}`
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

      default: break;
    }
  }

  onTabChangeForAllProviders(i, value, tab, ev) {
    if (!isNaN(i)) {
      window.history.pushState(
        window.config.endpointBase,
        'Title',
        `?tab=${i}`
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

  onActive(tab) {
    //console.log(tab)
  }

  render() {
    const {
      displayAllSuppliers,
      activeId,
      suppliers,
      filelistIsLoading,
      fileUploadProgress,
      lineStats,
      kc
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

    if (!displayAllSuppliers && suppliers.length) {
      var provider = suppliers.filter(p => {
        return p.id == activeId;
      })[0];
    }

    let canEditOrganisation = rolesParser.canEditOrganisation(kc.tokenParsed);

    if (displayAllSuppliers || provider) {
      let tabsToRender = null;

      if (displayAllSuppliers) {
        tabsToRender = (
          <Tabs
            justified={true}
            onChange={this.onTabChangeForAllProviders.bind(this)}
            defaultSelectedIndex={Number(getQueryVariable('tab')) || 0}
          >
            <Tab value="chouetteJobs" label="Chouette jobs">
              <ChouetteAllJobs />
            </Tab>
            <Tab value="events" label="Events">
              <EventDetails
                handleRefresh={this.handleRefreshAllProviders.bind(this)}
                dataSource={this.props.allProvidersEvents}
                key="statusList"
                locale="en"
                includeLevel2={true}
              />
            </Tab>
            <Tab value="statistics" label="Statistics">
              {suppliers.length &&
                <StatisticsDetails
                  dispatch={this.props.dispatch}
                  lineStats={lineStats}
                  suppliers={suppliers.filter(
                    s => !!s.chouetteInfo.migrateDataToProvider
                  )}
                />}
            </Tab>
            {canEditOrganisation
              ? <Tab
                  value="Organization register"
                  label="Organization register"
                >
                  <OrganizationRegister />
                </Tab>
              : null}
          </Tabs>
        );
      } else {
        tabsToRender = (
          <Tabs
            justified={true}
            onChange={this.onTabChangeForProvider.bind(this)}
            defaultSelectedIndex={Number(getQueryVariable('tab')) || 0}
          >
            <Tab
              value="migrateData"
              label="Migrate data"
              onActive={this.onActive}
            >
              <DataMigrationDetails />
            </Tab>
            <Tab value="events" label="Events">
              <EventDetails
                handleRefresh={this.handleRefreshActiveProvider.bind(this)}
                dataSource={this.props.providerEvents}
                locale="en"
                key="statusList"
                includeLevel2={true}
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
          <div style={{ marginLeft: 10, marginRight: 10 }}>
            {tabsToRender}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => {
  return {
    suppliers: state.SuppliersReducer.data,
    activeId: state.SuppliersReducer.activeId,
    filelistIsLoading: state.MardukReducer.filenames.isLoading,
    displayAllSuppliers: state.SuppliersReducer.all_suppliers_selected,
    providerEvents: state.SuppliersReducer.statusList,
    allProvidersEvents: state.SuppliersReducer.statusListAllProviders,
    fileUploadProgress: state.SuppliersReducer.fileUploadProgress,
    lineStats: state.SuppliersReducer.lineStats,
    kc: state.UserReducer.kc
  };
};

export default connect(mapStateToProps)(SupplierTabWrapper);
