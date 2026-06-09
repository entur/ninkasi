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
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import * as SuppliersReducer from 'reducers/SuppliersReducer';
const { fetchExportedFiles } = SuppliersReducer as any;
import ExportedFilesRow from './ExportedFilesRow';
import ExportedFilesHeader from './ExportedFilesHeader';

const mapProviderIdToKeys = (data: any[] | undefined): Record<string, string> | null => {
  if (data && data.length) {
    const providerIdKeys: Record<string, string> = {};
    data.forEach(provider => {
      if (provider.chouetteInfo && provider.chouetteInfo.referential) {
        providerIdKeys[provider.chouetteInfo.referential] = provider.name;
      }
    });
    return providerIdKeys;
  }
  return null;
};

const ExportedFilesView = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const files = useAppSelector(state => state.SuppliersReducer.exportedFiles);
  const providers = useAppSelector(state => mapProviderIdToKeys(state.SuppliersReducer.data));

  useEffect(() => {
    dispatch(fetchExportedFiles(getToken));
  }, [dispatch, getToken]);

  if (!files) return null;
  if (!providers) return null;

  const { providerData } = files;

  return (
    <div>
      <ExportedFilesHeader />
      {Object.keys(providerData).map((p, i) => (
        <ExportedFilesRow
          key={'files-row-' + p}
          index={i}
          providerName={providers[providerData[p].referential] || 'N/A'}
          referential={providerData[p].referential}
          data={providerData[p]}
        />
      ))}
    </div>
  );
};

export default ExportedFilesView;
