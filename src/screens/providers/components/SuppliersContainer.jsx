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

import { connect } from 'react-redux';
import React from 'react';
import withAuth from 'utils/withAuth';
import SuppliersActions from 'actions/SuppliersActions';
import cfgreader from 'config/readConfig';
import { Add, Edit, DeleteForever } from '@mui/icons-material';
import { getQueryVariable } from 'utils';
import ConfirmDialog from 'modals/ConfirmDialog';
import { SelectSupplier } from '../../common/components/SelectSupplier';

class SuppliersContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDialogOpen: false,
      confirmAction: null,
      confirmTitle: '',
      confirmInfo: ''
    };

    cfgreader.readConfig(function(config) {
      window.config = config;
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const id = getQueryVariable('id');
    dispatch(SuppliersActions.getAllProviders(this.props.getToken)).then(() => {
      if (id != null) {
        dispatch(
          SuppliersActions.selectActiveSupplier(Number(id), this.props.getToken)
        );
      }
    });
  }

  selectSupplier = value => {
    const { dispatch, getToken } = this.props;
    if (value > 0) {
      dispatch(SuppliersActions.selectActiveSupplier(value, getToken));
    } else {
      dispatch(SuppliersActions.selectAllSuppliers());
    }
  };

  handleNewProvider() {
    this.props.dispatch(SuppliersActions.openNewProviderDialog());
  }

  handleEditProvider() {
    this.props.dispatch(SuppliersActions.openEditProviderDialog());
  }

  handleOpenConfirmDeleteProviderDialog(open = true) {
    if (open) {
      const { dispatch, activeProviderId } = this.props;
      this.setState({
        confirmDialogOpen: true,
        confirmTitle: 'Delete provider',
        confirmInfo: 'Are you sure you want delete the provider?',
        confirmAction: () => {
          dispatch(SuppliersActions.deleteProvider(activeProviderId));
        }
      });
    } else {
      this.setState({
        confirmDialogOpen: false,
        confirmTitle: '',
        confirmInfo: '',
        confirmAction: null
      });
    }
  }

  render() {
    const { suppliers, activeProviderId, canEditOrganisation } = this.props;

    const supplierItems = [
      {
        id: -1,
        name: 'All providers'
      }
    ].concat(suppliers);

    const toolTips = {
      createNewProvider: 'Create new provider',
      deleteProvider: 'Delete provider',
      editProvider: 'Edit provider'
    };

    return (
      <div className="suppliers-container">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SelectSupplier
            suppliers={supplierItems}
            selectSupplier={this.selectSupplier}
            selectedSupplierId={activeProviderId}
          />
          {canEditOrganisation && (
            <div
              style={{
                display: 'inline-block',
                marginTop: 25,
                marginLeft: 15
              }}
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
                {!this.props.displayAllSuppliers && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Edit style={{ width: '1.1em', height: '1.1em' }} />
                    <span style={{ marginLeft: 2 }}>Edit</span>
                  </div>
                )}
              </div>
              <div
                title={toolTips.createNewProvider}
                style={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  marginRight: 10
                }}
                onClick={() => this.handleNewProvider()}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Add style={{ width: '1.2em', height: '1.2em' }} />
                  <span style={{ marginLeft: 2 }}>New</span>
                </div>
              </div>

              <div
                title={toolTips.deleteProvider}
                style={{ display: 'inline-block', cursor: 'pointer' }}
                onClick={() => this.handleOpenConfirmDeleteProviderDialog()}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DeleteForever style={{ width: '1.2em', height: '1.2em' }} />
                  <span style={{ marginLeft: 2 }}>Delete</span>
                </div>
              </div>
            </div>
          )}
        </div>
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
    );
  }
}

const mapStateToProps = state => ({
  suppliers: state.SuppliersReducer.data,
  activeProviderId: state.SuppliersReducer.activeId,
  displayAllSuppliers: state.SuppliersReducer.all_suppliers_selected,
  canEditOrganisation: state.UserContextReducer.isOrganisationAdmin
});

export default connect(mapStateToProps)(withAuth(SuppliersContainer));
