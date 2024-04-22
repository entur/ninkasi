import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import React from 'react';

export const SelectSupplier = ({
  suppliers,
  selectSupplier,
  selectedSupplierId,
  errorText
}) => {
  return (
    <>
      <SelectField
        id="select-supplier"
        floatingLabelFixed={true}
        style={{ minWidth: 350 }}
        floatingLabelText={'Provider'}
        onChange={(e, k, v) => selectSupplier(v)}
        autoWidth={true}
        value={Number(selectedSupplierId) || -1}
        iconStyle={{ fill: 'rgba(22, 82, 149, 0.69)' }}
      >
        {suppliers.map(supplier => {
          const isLevel1Provider =
            (supplier.chouetteInfo &&
              supplier.chouetteInfo.migrateDataToProvider) ||
            supplier.id === -1;
          return (
            <MenuItem
              key={supplier.id}
              value={supplier.id}
              label={supplier.name}
              primaryText={
                <span
                  style={{
                    color: isLevel1Provider ? 'intial' : '#d9a51b'
                  }}
                >
                  {supplier.name}
                </span>
              }
            />
          );
        })}
      </SelectField>
      {errorText && <div style={{ color: 'red' }}>{errorText}</div>}
    </>
  );
};
