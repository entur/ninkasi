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

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import { Button, TextField } from '@mui/material';
import AdvancedFileList from './AdvancedFileList';
import { sortFiles } from '@/utils';
import * as MardukReducer from 'reducers/MardukReducer';
const {
  importData,
  exportData,
  transferData,
  cleanDataspace,
  validateProvider,
  deleteJobsForProvider,
} = MardukReducer as any;
import {
  FaArrowDown,
  FaArrowUp,
  FaArrowLeft as FaRemove,
  FaArrowRight as FaAdd,
} from 'react-icons/fa';

interface SortOrder {
  ext: number;
  name: number;
  size: number;
  date: number;
}

const DataMigrationDetails = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const providers = useAppSelector(state => state.SuppliersReducer.data);
  const activeId = useAppSelector(state => state.SuppliersReducer.activeId);
  const chouetteInfo = useAppSelector(state => state.UtilsReducer.supplierForm?.chouetteInfo ?? {});
  const files = useAppSelector(state => state.MardukReducer.filenames.data || []);
  const importIsLoading = useAppSelector(state => state.MardukReducer.isLoading);
  const importError = useAppSelector(state => state.MardukReducer.error);

  const [outboundFiles, setOutboundFiles] = useState<any[]>([]);
  const [selectedIndicesOutbound, setSelectedIndicesOutbound] = useState<Set<number>>(new Set());
  const [selectedIndicesSource, setSelectedIndicesSource] = useState<Set<number>>(new Set());
  const [outboundFileSortOrder, setOutboundFileSortOrder] = useState<{ date: number }>({ date: 2 });
  const [sortOrder, setSortOrder] = useState<SortOrder>({
    ext: 0,
    name: 0,
    size: 0,
    date: 2,
  });
  const [filterText, setFilterText] = useState('');

  const prevImportIsLoadingRef = useRef(importIsLoading);
  useEffect(() => {
    const prev = prevImportIsLoadingRef.current;
    if (prev && !importIsLoading && !importError) {
      setOutboundFiles([]);
      setSelectedIndicesOutbound(new Set());
    }
    prevImportIsLoadingRef.current = importIsLoading;
  }, [importIsLoading, importError]);

  const handleUpdateIndicesSource = (indices: Set<number>) => {
    setSelectedIndicesSource(indices);
  };

  const handleUpdateIndicesOutbound = (indices: Set<number>) => {
    setSelectedIndicesOutbound(indices);
  };

  const handleSortOutboundFiles = () => {
    const newSortOrder = {
      date: outboundFileSortOrder.date === 1 ? 2 : 1,
    };
    setOutboundFileSortOrder(newSortOrder);
    setOutboundFiles(sortFiles([...outboundFiles], newSortOrder, ''));
  };

  const handleSelectAllShowingIndices = (source: boolean | undefined) => {
    if (source) {
      const sortedFiles = sortFiles([...files], sortOrder, filterText)
        .filter((file: any) => file.name.indexOf(filterText) > -1)
        .map((_f: any, i: number) => i);

      setSelectedIndicesSource(new Set(sortedFiles));
    } else {
      setSelectedIndicesOutbound(new Set(outboundFiles.map((_f, i) => i)));
    }
  };

  const handleKeyDown = (isSource: boolean | undefined, event: KeyboardEvent<HTMLDivElement>) => {
    if (isSource) {
      const isAllSelected = selectedIndicesSource.size === files.length;
      const highestIndex = Math.max(...Array.from(selectedIndicesSource.values()));
      const isLastSelected =
        highestIndex === files.filter((file: any) => file.name.indexOf(filterText) > -1).length - 1;

      if (!isAllSelected && !isLastSelected) {
        handleUpdateIndicesSource(new Set([highestIndex + 1]));
        event.preventDefault();
      }
    } else {
      const isAllSelected = outboundFiles.length === selectedIndicesOutbound.size;
      const highestIndex = Math.max(...Array.from(selectedIndicesOutbound.values()));
      const isLastSelected = highestIndex === outboundFiles.length - 1;

      if (!isAllSelected && !isLastSelected) {
        handleUpdateIndicesOutbound(new Set([highestIndex + 1]));
        event.preventDefault();
      }
    }
  };

  const handleKeyUp = (isSource: boolean | undefined, event: KeyboardEvent<HTMLDivElement>) => {
    if (isSource) {
      const isAllSelected =
        selectedIndicesSource.size ===
        files.filter((file: any) => file.name.indexOf(filterText) > -1).length;
      const lowestIndex = Math.min(...Array.from(selectedIndicesSource.values()));
      const isFirstSelected = lowestIndex === 0;

      if (!isAllSelected && !isFirstSelected) {
        event.preventDefault();
        handleUpdateIndicesSource(new Set([lowestIndex - 1]));
      }
    } else {
      const isAllSelected = outboundFiles.length === selectedIndicesOutbound.size;
      const lowestIndex = Math.max(...Array.from(selectedIndicesOutbound.values()));
      const isFirstSelected = lowestIndex === 0;

      if (!isAllSelected && !isFirstSelected) {
        event.preventDefault();
        handleUpdateIndicesOutbound(new Set([lowestIndex - 1]));
      }
    }
  };

  const handleSortByExt = () => {
    setSortOrder({
      ext: sortOrder.ext === 2 ? 0 : sortOrder.ext + 1,
      name: 0,
      date: 0,
      size: 0,
    });
  };

  const handleSortByName = () => {
    setSortOrder({
      name: sortOrder.name === 2 ? 0 : sortOrder.name + 1,
      ext: 0,
      date: 0,
      size: 0,
    });
  };

  const handleSortBySize = () => {
    setSortOrder({
      size: sortOrder.size === 2 ? 0 : sortOrder.size + 1,
      ext: 0,
      date: 0,
      name: 0,
    });
  };

  const handleSortByDate = () => {
    setSortOrder({
      date: sortOrder.date === 2 ? 0 : sortOrder.date + 1,
      ext: 0,
      name: 0,
      size: 0,
    });
  };

  const handleImportData = (isFlex = false) => {
    const provider = providers.find((p: any) => p.id === activeId);

    if (outboundFiles.length && provider) {
      if (
        provider.chouetteInfo &&
        provider.chouetteInfo.enableCleanImport &&
        outboundFiles.length > 1
      ) {
        alert('Clean before import enabled, does not make sense to import multiple files');
      } else {
        dispatch(importData({ id: activeId, selectedFiles: outboundFiles, isFlex, getToken }));
      }
    } else {
      alert('No files added to import');
    }
  };

  const handleExportData = () => {
    dispatch(exportData({ id: activeId, getToken }));
  };

  const handleTransferData = () => {
    dispatch(transferData({ id: activeId, getToken }));
  };

  const handleCleanDataspace = () => {
    const response = window.confirm(
      'Are you sure you want to clean up the dataspace current provider?'
    );
    if (response === true) {
      dispatch(cleanDataspace({ id: activeId, getToken }));
    }
  };

  const handleClearHistory = () => {
    const response = window.confirm(
      'Are you sure you want to clear event history for current provider?'
    );
    if (response === true) {
      dispatch(deleteJobsForProvider(activeId, getToken));
    }
  };

  const handleValidateProvider = () => {
    dispatch(validateProvider({ id: activeId, getToken }));
  };

  const moveDown = () => {
    const updatedIndices = new Set<number>();
    const maxValue = Math.max(...Array.from(selectedIndicesOutbound.values()));

    if (maxValue >= outboundFiles.length - 1) return;

    const nextOutboundFiles = [...outboundFiles];
    selectedIndicesOutbound.forEach(value => {
      if (value > -1) {
        nextOutboundFiles.splice(value + 1, 0, nextOutboundFiles.splice(value, 1)[0]);
        updatedIndices.add(value + 1);
      } else {
        updatedIndices.add(value);
      }
    });

    setOutboundFiles(nextOutboundFiles);
    setSelectedIndicesOutbound(updatedIndices);
  };

  const moveUp = () => {
    const updatedIndices = new Set<number>();
    const minIndex = Math.min(...Array.from(selectedIndicesOutbound.values()));

    if (!minIndex) return;

    const nextOutboundFiles = [...outboundFiles];
    selectedIndicesOutbound.forEach(value => {
      if (value) {
        nextOutboundFiles.splice(value - 1, 0, nextOutboundFiles.splice(value, 1)[0]);
        updatedIndices.add(value - 1);
      } else {
        updatedIndices.add(value);
      }
    });

    setOutboundFiles(nextOutboundFiles);
    setSelectedIndicesOutbound(updatedIndices);
  };

  const appendSelectedFiles = () => {
    if (!selectedIndicesSource.size) return;

    const sortedFiles = sortFiles([...files], sortOrder, filterText);
    const filestoAppend = Array.from(selectedIndicesSource).map(i => sortedFiles[i]);
    const updateOutboundFiles = Array.from(new Set(outboundFiles.concat(filestoAppend)));

    setOutboundFiles(updateOutboundFiles);
    setSelectedIndicesSource(new Set());
  };

  const removeSelectedFiles = () => {
    const filteredList: any[] = [];

    outboundFiles.forEach((file, index) => {
      const indices = Array.from(selectedIndicesOutbound);
      if (indices.indexOf(index) === -1) {
        filteredList.push(file);
      }
    });

    setOutboundFiles(filteredList);
    setSelectedIndicesOutbound(new Set());
  };

  const isLevel1Provider = !!chouetteInfo.migrateDataToProvider;
  const sortedFiles = sortFiles([...files], sortOrder, filterText);

  const toolTips = {
    import:
      'Import all files listed in the list on the right side below. Files will be imported in the given order. If success, VALIDATE will be called',
    importFlex:
      'Import all flex data files listed in the list on the right side below. Files will be imported in the given order. If success, VALIDATE will be called',
    validate:
      'Validate data in dataspace. If success, TRANSFER will be called if in level 1 space or EXPORT if in level 2 space',
    transfer:
      'Transfer data from this space to the next space (Rutebanken space with id ' +
      chouetteInfo.migrateDataToProvider +
      '). If success, VALIDATE in level 2 space will be called',
    export: 'Export GTFS data and trigger bulding',
    clearEventHistory: 'Clean event history',
    clean: 'Clean data space (delete ALL transport data)',
    cleanStopPlacesChouette: 'Clean Stop place register in Chouette',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        {isLevel1Provider ? (
          <>
            <Button
              title={toolTips.import}
              color="primary"
              variant="contained"
              onClick={() => handleImportData(false)}
              sx={{ mr: 1 }}
            >
              Import
            </Button>
            <Button
              title={toolTips.importFlex}
              color="success"
              variant="contained"
              onClick={() => handleImportData(true)}
              sx={{ mr: 1 }}
            >
              Import flex
            </Button>
          </>
        ) : null}
        <Button
          title={toolTips.validate}
          color="primary"
          variant="contained"
          onClick={handleValidateProvider}
          sx={{ mr: 1 }}
        >
          Validate
        </Button>
        {isLevel1Provider ? (
          <Button
            title={toolTips.transfer}
            color="primary"
            variant="contained"
            onClick={handleTransferData}
            sx={{ mr: 1 }}
          >
            Transfer
          </Button>
        ) : (
          <Button
            title={toolTips.export}
            color="primary"
            variant="contained"
            onClick={handleExportData}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
        )}
        <Button
          title={toolTips.clearEventHistory}
          color="error"
          variant="contained"
          onClick={handleClearHistory}
          sx={{ mr: 1 }}
        >
          Clear history
        </Button>
        <Button
          title={toolTips.clean}
          color="error"
          variant="contained"
          onClick={handleCleanDataspace}
        >
          Clean
        </Button>
      </div>
      {isLevel1Provider ? (
        <TextField
          placeholder="Filter ..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
      ) : (
        <div
          style={{
            fontWeight: 600,
            marginTop: 20,
            width: '100%',
            textAlign: 'center',
          }}
        >
          Level 2 provider
        </div>
      )}
      {isLevel1Provider ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AdvancedFileList
            selectedIndices={selectedIndicesSource}
            updateIndices={handleUpdateIndicesSource}
            downloadButton
            activeProviderId={activeId}
            files={sortedFiles}
            isSource
            handleSortBySize={handleSortBySize}
            handleSortByName={handleSortByName}
            handleSortByDate={handleSortByDate}
            handleSortByExt={handleSortByExt}
            handleKeyDown={handleKeyDown}
            handleKeyUp={handleKeyUp}
            handleSelectAllShowingIndices={handleSelectAllShowingIndices}
          />
          {sortedFiles.length ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 0.1,
                cursor: 'pointer',
              }}
            >
              <FaAdd
                style={{
                  transform: 'scale(2)',
                  color: '#2196f3',
                  marginBottom: 30,
                  marginLeft: 20,
                  marginRight: 20,
                }}
                onClick={appendSelectedFiles}
              />
              <FaRemove
                style={{
                  transform: 'scale(2)',
                  color: outboundFiles.length ? '#b91c1c' : '#9e9e9e',
                  marginLeft: 20,
                  marginRight: 20,
                }}
                onClick={removeSelectedFiles}
              />
            </div>
          ) : (
            <div style={{ margin: 20, fontWeight: 600 }}>No files available</div>
          )}
          <AdvancedFileList
            selectedIndices={selectedIndicesOutbound}
            files={outboundFiles}
            updateIndices={handleUpdateIndicesOutbound}
            handleKeyDown={handleKeyDown}
            handleKeyUp={handleKeyUp}
            handleSortByDate={handleSortOutboundFiles}
            handleSelectAllShowingIndices={handleSelectAllShowingIndices}
          />
          <div
            style={{
              flex: 0.2,
              display: outboundFiles.length ? 'flex' : 'none',
              alignItems: 'center',
              flexDirection: 'column',
              cursor: 'pointer',
            }}
          >
            <FaArrowDown
              style={{
                transform: 'scale(2)',
                marginBottom: 30,
                marginLeft: 20,
              }}
              onClick={moveDown}
            />
            <FaArrowUp style={{ transform: 'scale(2)', marginLeft: 20 }} onClick={moveUp} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DataMigrationDetails;
