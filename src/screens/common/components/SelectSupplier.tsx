import { memo, useCallback } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';

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
    const selected = suppliers.find(s => s.id === selectedSupplierId) ?? null;

    const handleChange = useCallback(
      (_event: unknown, value: Supplier | null) => {
        selectSupplier(value ? value.id : -1);
      },
      [selectSupplier]
    );

    return (
      <Box sx={{ minWidth: 350 }}>
        <Autocomplete
          size="small"
          options={suppliers}
          value={selected}
          onChange={handleChange}
          getOptionLabel={option => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          disableClearable={selected?.id === -1}
          renderInput={params => (
            <TextField
              {...params}
              placeholder="Select provider"
              error={Boolean(errorText)}
              helperText={errorText}
              sx={{
                m: 0,
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}
            />
          )}
        />
      </Box>
    );
  }
);
