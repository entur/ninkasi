import { Box, FormControl, NativeSelect } from '@mui/material';
import { memo, useCallback } from 'react';

interface Supplier {
  id: number;
  name: string;
}

interface Props {
  suppliers: Supplier[];
  selectSupplier: (id: number) => void;
  selectedSupplierId: number;
  errorText?: string;
}

export const SelectSupplier = memo(
  ({ suppliers, selectSupplier, selectedSupplierId, errorText }: Props) => {
    // Ensure we have a valid value that matches one of the option values.
    const validSupplierIds = suppliers.map(s => s.id);
    const currentValue = validSupplierIds.includes(selectedSupplierId) ? selectedSupplierId : -1;

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(event.target.value, 10);
        selectSupplier(value);
      },
      [selectSupplier]
    );

    return (
      <>
        <FormControl variant="outlined" sx={{ minWidth: 350 }}>
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
                  backgroundColor: 'background.paper',
                },
              },
            }}
          >
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
        {errorText && <Box sx={{ color: 'red' }}>{errorText}</Box>}
      </>
    );
  }
);
