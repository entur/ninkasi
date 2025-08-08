import React from 'react';
import SuppliersContainer from './components/SuppliersContainer';
import SupplierTabWrapper from './components/SupplierTabWrapper';
import SupplierPage from './components/SupplierPage';
import AdministrativeActions from './components/AdministrativeActions';
import { connect } from 'react-redux';
import { ShowOTPGraphStatus } from './components/ShowOTPGraphStatus';

const Providers = ({ isAdmin }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {isAdmin && <AdministrativeActions />}
        <div style={{ display: 'flex' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                margin: '0 20px',
                justifyContent: 'space-between'
              }}
            >
              <SuppliersContainer />
              <ShowOTPGraphStatus />
            </div>
            <SupplierTabWrapper />
            <SupplierPage />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isAdmin: state.UserContextReducer.isRouteDataAdmin
});

export default connect(mapStateToProps)(Providers);
