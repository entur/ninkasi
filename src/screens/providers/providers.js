import React from 'react';
import SuppliersContainer from './components/SuppliersContainer';
import SupplierTabWrapper from './components/SupplierTabWrapper';
import SupplierPage from './components/SupplierPage';
import ModalViewContainer from 'modals/ModalActionContainer';
import rolesParser from 'roles/rolesParser';
import AdministrativeActions from './components/AdministrativeActions';
import { connect } from 'react-redux';
import { ShowOTPGraphStatus } from './components/ShowOTPGraphStatus';

const Providers = ({ auth }) => {
  const isAdmin = rolesParser.isAdmin(auth.roleAssignments);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {isAdmin && <AdministrativeActions />}
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <SuppliersContainer />
            <SupplierTabWrapper />
            <ModalViewContainer />
            <SupplierPage />
          </div>
          <ShowOTPGraphStatus />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.UserReducer.auth
});

export default connect(mapStateToProps)(Providers);
