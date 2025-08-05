import { FormControl, NativeSelect } from '@mui/material';
import React, { memo, useCallback } from 'react';

export const SelectSupplier = memo(
  ({ suppliers, selectSupplier, selectedSupplierId, errorText }) => {
    // Ensure we have a valid value that matches one of the option values
    const validSupplierIds = suppliers.map(s => s.id);
    const currentValue = validSupplierIds.includes(selectedSupplierId)
      ? selectedSupplierId
      : -1;

    const handleChange = useCallback(
      event => {
        const value = parseInt(event.target.value, 10);
        selectSupplier(value);
      },
      [selectSupplier]
    );

    return (
      <>
        <FormControl variant="outlined" style={{ minWidth: 350 }}>
          <NativeSelect
            value={currentValue}
            onChange={handleChange}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 1,
              '& .MuiNativeSelect-select': {
                padding: '10px 14px',
                '&:focus': {
                  borderRadius: 1,
                  backgroundColor: 'background.paper'
                }
              }
            }}
          >
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
        {errorText && <div style={{ color: 'red' }}>{errorText}</div>}
      </>
    );
  }
);
