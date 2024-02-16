import { SelectSupplier } from '../../../common/components/SelectSupplier';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { FileUpload } from '../../../common/components/FileUpload';
import SuppliersActions from '../../../../actions/SuppliersActions';

export const TariffZonesImport = () => {
  const suppliers = useSelector(
    state => state.SuppliersReducer.data,
    shallowEqual
  );

  const tariffZoneFileUploadProgress = useSelector(
    state => state.SuppliersReducer.tariffZoneFileUploadProgress,
    shallowEqual
  );

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [noSupplierSelected, setNoSupplierSelected] = useState(null);
  const dispatch = useDispatch();

  const handleFileUpload = files => {
    if (selectedSupplier === null) {
      setNoSupplierSelected(true);
    } else {
      dispatch(
        SuppliersActions.uploadTariffZonesFiles(files, selectedSupplier)
      );
    }
  };

  const onSelectSupplier = selectedSupplierId => {
    setNoSupplierSelected(false);
    setSelectedSupplier(
      suppliers.find(supplier => supplier.id === selectedSupplierId)
    );
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <SelectSupplier
        suppliers={suppliers}
        selectSupplier={onSelectSupplier}
        selectedSupplierId={selectedSupplier && selectedSupplier.id}
        errorText={noSupplierSelected === true && 'No Supplier selected'}
      />
      <div style={{ width: '50%', marginTop: '20px' }}>
        <FileUpload
          fileUploadProgress={tariffZoneFileUploadProgress}
          handleFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};
