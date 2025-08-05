import { FormControl, Select, MenuItem } from '@mui/material';
import React from 'react';

export const SelectSupplier = ({
  suppliers,
  selectSupplier,
  selectedSupplierId,
  errorText
}) => {
  return (
    <>
      <FormControl style={{ minWidth: 350 }}>
        <Select
          id="select-supplier"
          onChange={e => selectSupplier(e.target.value)}
          value={Number(selectedSupplierId) || -1}
          displayEmpty
        >
          {suppliers.map(supplier => {
            const isLevel1Provider =
              (supplier.chouetteInfo &&
                supplier.chouetteInfo.migrateDataToProvider) ||
              supplier.id === -1;
            return (
              <MenuItem key={supplier.id} value={supplier.id}>
                <span
                  style={{
                    color: isLevel1Provider ? 'intial' : '#d9a51b'
                  }}
                >
                  {supplier.name}
                </span>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {errorText && <div style={{ color: 'red' }}>{errorText}</div>}
    </>
  );
};
