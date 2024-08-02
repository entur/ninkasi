import React from 'react';
import SuppliersContainer from './components/SuppliersContainer';
import SupplierTabWrapper from './components/SupplierTabWrapper';
import SupplierPage from './components/SupplierPage';
import ModalViewContainer from 'modals/ModalActionContainer';
import AdministrativeActions from './components/AdministrativeActions';
import { connect } from 'react-redux';
import { ShowOTPGraphStatus } from './components/ShowOTPGraphStatus';

const Providers = ({ auth, isAdmin }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {isAdmin && <AdministrativeActions />}
        <div style={{ display: 'flex' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
          >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <SuppliersContainer />
              <ShowOTPGraphStatus />
            </div>
            <SupplierTabWrapper />
            <ModalViewContainer />
            <SupplierPage />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.UserReducer.auth,
  isAdmin: state.UserContextReducer.isRouteDataAdmin
});

export default connect(mapStateToProps)(Providers);
