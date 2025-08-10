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
import cfgreader from 'config/readConfig';
import SuppliersActions from 'actions/SuppliersActions';
import ModalEditProvider from 'modals/ModalEditProvider';

class SupplierPage extends React.Component {
  componentWillMount() {
    const { id, dispatch, getToken } = this.props;
    cfgreader.readConfig(function (config) {
      window.config = config;
      if (id) {
        dispatch(SuppliersActions.fetchProvider(id, getToken));
      }
    });
  }

  handleUpdateProvider(data) {
    const { shouldUpdate, dispatch, getToken } = this.props;

    if (shouldUpdate) {
      dispatch(SuppliersActions.updateProvider(data, getToken));
    } else {
      dispatch(SuppliersActions.createProvider(data, getToken));
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  provider: state.UtilsReducer.supplierForm,
  id: state.SuppliersReducer.activeId,
  isModalOpen: state.UtilsReducer.editProviderModal,
  shouldUpdate: state.UtilsReducer.shouldUpdateProvider,
  providers: state.SuppliersReducer.data,
});

export default connect(mapStateToProps)(withAuth(SupplierPage));
