import { SelectSupplier } from '../../../common/components/SelectSupplier';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export const TariffZonesImport = () => {
  const suppliers = useSelector(state => state.SuppliersReducer.data, []);
  const [selectedSupplier, setSelectedSupplier] = useState();

  return null;
  {
    /*
  <SelectSupplier

  />;
*/
  }
};
