import React from 'react';
import SuppliersContainer from './components/SuppliersContainer';
import SupplierTabWrapper from './components/SupplierTabWrapper';
import SupplierPage from './components/SupplierPage';
import ModalViewContainer from 'modals/ModalActionContainer';

export default () => {
  return (
    <div>
      <SuppliersContainer />
      <SupplierTabWrapper />
      <ModalViewContainer />
      <SupplierPage />
    </div>
  );
};
