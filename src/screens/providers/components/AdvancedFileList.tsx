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

import type { KeyboardEvent, MouseEvent } from 'react';
import { format } from 'date-fns';
import { Box } from '@mui/material';
import { FileDownload } from '@mui/icons-material';
import { getSizeFromBytes } from '@/utils';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { useAccessToken } from '@/utils/useAccessToken';

interface FileItem {
  name: string;
  fileSize: number;
  ext?: string;
  updated: string;
}

interface Props {
  files: FileItem[];
  selectedIndices: Set<number>;
  updateIndices: (indices: Set<number>) => void;
  downloadButton?: boolean;
  isSource?: boolean;
  activeProviderId?: number | string;
  handleKeyDown: (isSource: boolean | undefined, e: KeyboardEvent<HTMLDivElement>) => void;
  handleKeyUp: (isSource: boolean | undefined, e: KeyboardEvent<HTMLDivElement>) => void;
  handleSelectAllShowingIndices: (isSource: boolean | undefined) => void;
  handleSortByName?: () => void;
  handleSortBySize?: () => void;
  handleSortByExt?: () => void;
  handleSortByDate: () => void;
}

const AdvancedFileList = ({
  files,
  selectedIndices,
  updateIndices,
  downloadButton,
  isSource,
  activeProviderId,
  handleKeyDown,
  handleKeyUp,
  handleSelectAllShowingIndices,
  handleSortByName,
  handleSortBySize,
  handleSortByExt,
  handleSortByDate,
}: Props) => {
  const { getToken } = useAccessToken();

  const handleDownloadFile = async (e: MouseEvent, filename: string) => {
    e.stopPropagation();

    try {
      // feature detection
      const isFileSaverSupport = !!new Blob();
      void isFileSaverSupport;

      const URL = `${window.config.timetableAdminBaseUrl}${activeProviderId}/files/${filename}`;

      const { data } = await axios.get(URL, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      saveAs(data, filename);
    } catch (err) {
      console.log('File download failed', { error: err });
      alert('Sorry, your browser is not supported for downloads.');
    }
  };

  const handleSelectAll = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 40) {
      handleKeyDown(isSource, e);
    }

    if (e.keyCode === 38) {
      handleKeyUp(isSource, e);
    }

    // handle select-all (cmd+a or ctrl+a)
    if (files.length && e.keyCode === 65 && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSelectAllShowingIndices(isSource);
    }
  };

  const handleMenuItemOnClick = (e: MouseEvent, index: number) => {
    const controlled = e.ctrlKey || e.metaKey;

    if (e.shiftKey && selectedIndices.size) {
      const previousMax = Math.max(...Array.from(selectedIndices.values()));
      const indicesToAdd: number[] = [];

      if (previousMax > index) {
        for (let i = index; i <= previousMax; i++) {
          indicesToAdd.push(i);
        }
      } else {
        for (let i = previousMax; i <= index; i++) {
          indicesToAdd.push(i);
        }
      }
      updateIndices(new Set(indicesToAdd));
    } else {
      const indices = controlled ? selectedIndices.add(index) : new Set([index]);
      updateIndices(indices);
    }
  };

  const headerStyle = {
    marginRight: '5px',
    paddingTop: '10px',
    paddingBottom: '10px',
    display: 'table-cell',
    cursor: 'pointer',
    borderBottom: '1px solid grey',
    borderRight: '1px solid grey',
    paddingLeft: '10px',
    paddingRight: '10px',
    maxWidth: '30%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
  };

  const columnStyle = {
    verticalAlign: 'middle',
    display: 'table-cell',
    paddingRight: '10px',
    textIndent: 5,
    maxWidth: '30%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
  };

  return (
    <Box
      tabIndex={isSource ? 1 : 2}
      sx={{
        mb: 2.5,
        resize: 'vertical',
        minHeight: 400,
        fontSize: '0.9em',
        overflow: 'auto',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        WebkitAppearance: 'listbox',
        boxSizing: 'border-box',
        border: '1px solid black',
        lineHeight: '1.2',
        tableLayout: 'fixed',
        height: '60vh',
        minWidth: '42vw',
      }}
      onKeyDown={handleSelectAll}
    >
      <Box
        sx={{
          display: files.length ? 'table-header-group' : 'none',
          minWidth: '100%',
          color: '#191919',
          fontWeight: 600,
          background: '#F5F4F4',
        }}
      >
        <Box sx={headerStyle} onClick={() => isSource && handleSortByName?.()}>
          <Box component="span" sx={{ borderBottom: isSource ? '1px dotted black' : 'none' }}>
            Filename
          </Box>
        </Box>
        <Box sx={headerStyle} onClick={() => isSource && handleSortBySize?.()}>
          <Box component="span" sx={{ borderBottom: isSource ? '1px dotted black' : 'none' }}>
            Size
          </Box>
        </Box>
        <Box sx={headerStyle} onClick={() => isSource && handleSortByExt?.()}>
          <Box component="span" sx={{ borderBottom: isSource ? '1px dotted black' : 'none' }}>
            Ext
          </Box>
        </Box>
        <Box sx={{ ...headerStyle, width: '75%' }} onClick={() => handleSortByDate()}>
          <Box component="span" sx={{ borderBottom: '1px dotted black' }}>
            Updated
          </Box>
        </Box>
        <Box sx={{ ...headerStyle, width: '99%' }}>
          <span />
        </Box>
      </Box>
      {files.map((file, index) => {
        const selected = selectedIndices.has(index);

        return (
          <Box
            key={'afl-item' + index}
            sx={{
              fontSize: '0.9em',
              border: '1px solid #d8d8d8',
              marginLeft: '10px',
              marginRight: '10px',
              display: 'table-row',
              cursor: 'pointer',
              background: selected ? '#4682b4' : '#fff',
              color: selected ? '#fff' : '#000',
              verticalAlign: 'middle',
              height: 20,
              lineHeight: 3,
              overflowY: 'auto',
            }}
            onClick={e => handleMenuItemOnClick(e, index)}
            onDoubleClick={e => {
              e.preventDefault();
            }}
          >
            <Box sx={columnStyle}>{file.name}</Box>
            <Box sx={columnStyle}>{getSizeFromBytes(file.fileSize)}</Box>
            <Box sx={columnStyle}> {file.ext}</Box>
            <Box sx={columnStyle}>{format(new Date(file.updated), 'yyyy-MM-dd HH:mm:ss')}</Box>
            {downloadButton ? (
              <Box
                sx={{
                  verticalAlign: 'middle',
                  display: 'table-cell',
                  width: 50,
                  paddingLeft: '10px',
                  background: '#fff',
                }}
              >
                <FileDownload
                  sx={{
                    marginTop: '1px',
                    fill: '#2196F3',
                    verticalAlign: 'middle',
                  }}
                  onClick={e => handleDownloadFile(e, file.name)}
                />
              </Box>
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
};

export default AdvancedFileList;
