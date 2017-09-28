import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import NotificationContainer from './NotificationContainer';
import cfgreader from '../config/readConfig';
import SuppliersActions from '../actions/SuppliersActions';
import ModalEditProvider from '../modals/ModalEditProvider';

class SupplierPage extends React.Component {
  componentWillMount() {
    const { id, dispatch } = this.props;
    cfgreader.readConfig(
      function(config) {
        window.config = config;
        if (id) {
          dispatch(SuppliersActions.fetchProvider(id));
        }
      }.bind(this)
    );
  }

  handleUpdateProvider(data) {
    const { shouldUpdate, dispatch } = this.props;

    if (shouldUpdate) {
      dispatch(SuppliersActions.updateProvider(data));
    } else {
      dispatch(SuppliersActions.createProvider(data));
    }
    this.handleClose();
  }

  handleClose() {
    this.props.dispatch(SuppliersActions.dismissEditProviderDialog());
  }

  render() {
    const { provider, providers, isModalOpen, shouldUpdate } = this.props;

    return (
      <div>
        <ModalEditProvider
          open={isModalOpen}
          shouldUpdate={shouldUpdate}
          provider={provider}
          providers={providers}
          handleSubmit={this.handleUpdateProvider.bind(this)}
          handleClose={this.handleClose.bind(this)}
        />
        <NotificationContainer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  provider: state.UtilsReducer.supplierForm,
  id: state.SuppliersReducer.activeId,
  isModalOpen: state.UtilsReducer.editProviderModal,
  shouldUpdate: state.UtilsReducer.shouldUpdateProvider,
  providers: state.SuppliersReducer.data
});

export default connect(mapStateToProps)(SupplierPage);
