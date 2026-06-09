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
import moment from 'moment';
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

  const headerStyle: React.CSSProperties = {
    marginRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    display: 'table-cell',
    cursor: 'pointer',
    borderBottom: '1px solid grey',
    borderRight: '1px solid grey',
    paddingLeft: 10,
    paddingRight: 10,
    maxWidth: '30%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
  };

  const columnStyle: React.CSSProperties = {
    verticalAlign: 'middle',
    display: 'table-cell',
    paddingRight: 10,
    textIndent: 5,
    maxWidth: '30%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
  };

  return (
    <div
      className="multiselect unselectable"
      tabIndex={isSource ? 1 : 2}
      style={{
        border: '1px solid black',
        lineHeight: '1.2',
        tableLayout: 'fixed',
        height: '60vh',
        minWidth: '42vw',
      }}
      onKeyDown={handleSelectAll}
    >
      <div
        style={{
          display: files.length ? 'table-header-group' : 'none',
          minWidth: '100%',
          color: '#191919',
          fontWeight: 600,
          background: '#F5F4F4',
        }}
      >
        <div style={headerStyle} onClick={() => isSource && handleSortByName?.()}>
          <span style={{ borderBottom: isSource ? '1px dotted black' : 'none' }}>Filename</span>
        </div>
        <div style={headerStyle} onClick={() => isSource && handleSortBySize?.()}>
          <span style={{ borderBottom: isSource ? '1px dotted black' : 'none' }}>Size</span>
        </div>
        <div style={headerStyle} onClick={() => isSource && handleSortByExt?.()}>
          <span style={{ borderBottom: isSource ? '1px dotted black' : 'none' }}>Ext</span>
        </div>
        <div style={{ ...headerStyle, width: '75%' }} onClick={() => handleSortByDate()}>
          <span style={{ borderBottom: '1px dotted black' }}>Updated</span>
        </div>
        <div style={{ ...headerStyle, width: '99%' }}>
          <span />
        </div>
      </div>
      {files.map((file, index) => {
        const selected = selectedIndices.has(index);

        return (
          <div
            key={'afl-item' + index}
            style={{
              fontSize: '0.9em',
              border: '1px solid #d8d8d8',
              marginLeft: 10,
              marginRight: 10,
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
            <div style={columnStyle}>{file.name}</div>
            <div style={columnStyle}>{getSizeFromBytes(file.fileSize)}</div>
            <div style={columnStyle}> {file.ext}</div>
            <div style={columnStyle}>
              {moment(file.updated).format('YYYY-MM-DD HH:mm:ss').toString()}
            </div>
            {downloadButton ? (
              <div
                style={{
                  verticalAlign: 'middle',
                  display: 'table-cell',
                  width: 50,
                  paddingLeft: 10,
                  background: '#fff',
                }}
              >
                <FileDownload
                  style={{
                    marginTop: 1,
                    fill: '#2196F3',
                    verticalAlign: 'middle',
                  }}
                  onClick={e => handleDownloadFile(e, file.name)}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default AdvancedFileList;
