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

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import cfgreader from 'config/readConfig';
import * as SuppliersReducer from 'reducers/SuppliersReducer';
const { fetchProvider, createProvider, updateProvider } = SuppliersReducer as any;
import { dismissEditProviderDialog } from 'reducers/UtilsReducer';
import ModalEditProvider from 'modals/ModalEditProvider';

const SupplierPage = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const provider = useAppSelector(state => state.UtilsReducer.supplierForm);
  const id = useAppSelector(state => state.SuppliersReducer.activeId);
  const isModalOpen = useAppSelector(state => state.UtilsReducer.editProviderModal);
  const shouldUpdate = useAppSelector(state => state.UtilsReducer.shouldUpdateProvider);
  const providers = useAppSelector(state => state.SuppliersReducer.data);

  useEffect(() => {
    cfgreader.readConfig(function (config: any) {
      window.config = config;
      if (id) {
        dispatch(fetchProvider({ id, getToken }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    dispatch(dismissEditProviderDialog());
  };

  const handleUpdateProvider = (data: any) => {
    if (shouldUpdate) {
      dispatch(updateProvider({ data, getToken }));
    } else {
      dispatch(createProvider({ data, getToken }));
    }
    handleClose();
  };

  return (
    <div>
      <ModalEditProvider
        open={isModalOpen}
        shouldUpdate={shouldUpdate}
        provider={provider}
        providers={providers}
        handleSubmit={handleUpdateProvider}
        handleClose={handleClose}
      />
    </div>
  );
};

export default SupplierPage;
