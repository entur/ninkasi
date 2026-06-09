/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import cfgreader from 'config/readConfig';
import { Box } from '@mui/material';
import { Add, Edit, DeleteForever } from '@mui/icons-material';
import { getQueryVariable } from '@/utils';
import ConfirmDialog from 'modals/ConfirmDialog';
import { SelectSupplier as RawSelectSupplier } from '../../common/components/SelectSupplier';
const SelectSupplier = RawSelectSupplier as any;
import * as SuppliersReducer from 'reducers/SuppliersReducer';
const {
  fetchAllProviders,
  selectActiveSupplier,
  selectAllSuppliers,
  deleteProvider,
  openEditProviderDialog,
} = SuppliersReducer as any;
import { openedNewProviderDialog } from 'reducers/UtilsReducer';

const SuppliersContainer = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const suppliers = useAppSelector(state => state.SuppliersReducer.data);
  const activeProviderId = useAppSelector(state => state.SuppliersReducer.activeId);
  const displayAllSuppliers = useAppSelector(
    state => state.SuppliersReducer.all_suppliers_selected
  );
  const canEditOrganisation = useAppSelector(state => state.UserContextReducer.isOrganisationAdmin);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmInfo, setConfirmInfo] = useState('');

  useEffect(() => {
    cfgreader.readConfig(function (config: any) {
      window.config = config;
    });
  }, []);

  useEffect(() => {
    const id = getQueryVariable('id');
    (dispatch(fetchAllProviders(getToken)) as unknown as Promise<unknown>).then(() => {
      if (id != null) {
        dispatch(selectActiveSupplier(Number(id), getToken));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectSupplier = (value: number) => {
    if (value > 0) {
      dispatch(selectActiveSupplier(value, getToken));
    } else {
      dispatch(selectAllSuppliers());
    }
  };

  const handleNewProvider = () => {
    dispatch(openedNewProviderDialog());
  };

  const handleEditProvider = () => {
    dispatch(openEditProviderDialog(getToken));
  };

  const handleOpenConfirmDeleteProviderDialog = (open = true) => {
    if (open) {
      setConfirmDialogOpen(true);
      setConfirmTitle('Delete provider');
      setConfirmInfo('Are you sure you want delete the provider?');
      setConfirmAction(() => () => {
        dispatch(deleteProvider({ providerId: activeProviderId, getToken }));
      });
    } else {
      setConfirmDialogOpen(false);
      setConfirmTitle('');
      setConfirmInfo('');
      setConfirmAction(null);
    }
  };

  const supplierItems = [
    {
      id: -1,
      name: 'All providers',
    },
    ...suppliers,
  ];

  const toolTips = {
    createNewProvider: 'Create new provider',
    deleteProvider: 'Delete provider',
    editProvider: 'Edit provider',
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <SelectSupplier
          suppliers={supplierItems}
          selectSupplier={selectSupplier}
          selectedSupplierId={activeProviderId}
        />
        {canEditOrganisation && (
          <div
            style={{
              display: 'inline-block',
              marginTop: 25,
              marginLeft: 15,
            }}
          >
            <div
              title={toolTips.editProvider}
              style={{
                display: 'inline-block',
                cursor: 'pointer',
                marginRight: 10,
              }}
              onClick={handleEditProvider}
            >
              {!displayAllSuppliers && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Edit style={{ width: '1.1em', height: '1.1em' }} />
                  <span style={{ marginLeft: 2 }}>Edit</span>
                </div>
              )}
            </div>
            <div
              title={toolTips.createNewProvider}
              style={{
                display: 'inline-block',
                cursor: 'pointer',
                marginRight: 10,
              }}
              onClick={handleNewProvider}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Add style={{ width: '1.2em', height: '1.2em' }} />
                <span style={{ marginLeft: 2 }}>New</span>
              </div>
            </div>

            <div
              title={toolTips.deleteProvider}
              style={{ display: 'inline-block', cursor: 'pointer' }}
              onClick={() => handleOpenConfirmDeleteProviderDialog()}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <DeleteForever style={{ width: '1.2em', height: '1.2em' }} />
                <span style={{ marginLeft: 2 }}>Delete</span>
              </div>
            </div>
          </div>
        )}
      </Box>
      <ConfirmDialog
        open={confirmDialogOpen}
        handleSubmit={confirmAction}
        title={confirmTitle}
        info={confirmInfo}
        handleClose={() => {
          setConfirmDialogOpen(false);
          setConfirmAction(null);
        }}
      />
    </Box>
  );
};

export default SuppliersContainer;
