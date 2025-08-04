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

import { connect } from 'react-redux';
import React from 'react';
import withAuth from 'utils/withAuth';
import Button from 'muicss/lib/react/button';
import SuppliersActions from 'actions/SuppliersActions';
import AdvancedFileList from './AdvancedFileList';
import TextField from 'material-ui/TextField';
import { sortFiles } from 'utils';

const FaArrowDown = require('react-icons/lib/fa/arrow-down');
const FaArrowUp = require('react-icons/lib/fa/arrow-up');
const FaRemove = require('react-icons/lib/fa/arrow-left');
const FaAdd = require('react-icons/lib/fa/arrow-right');

class DataMigrationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outboundFiles: [],
      selectedIndicesOutbound: new Set(),
      selectedIndicesSource: new Set(),
      outboundFileSortOrder: {
        date: 2
      },
      sortOrder: {
        ext: 0,
        name: 0,
        size: 0,
        date: 2
      },
      filterText: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.importIsLoading &&
      !nextProps.importIsLoading &&
      !nextProps.importError
    ) {
      this.setState({
        outboundFiles: [],
        selectedIndicesOutbound: new Set()
      });
    }
  }

  handleUpdateIndicesSource(indices) {
    this.setState({
      selectedIndicesSource: indices
    });
  }

  handleUpdateIndicesOutbound(indices) {
    this.setState({
      selectedIndicesOutbound: indices
    });
  }

  handleSortOutboundFiles() {
    const { outboundFileSortOrder, outboundFiles } = this.state;
    const newSortOrder = {
      date: outboundFileSortOrder.date === 1 ? 2 : 1
    };

    this.setState({
      outboundFileSortOrder: newSortOrder,
      outboundFiles: sortFiles(outboundFiles, newSortOrder, '')
    });
  }

  handleSelectAllShowingIndices(source) {
    const { outboundFiles, filterText, sortOrder } = this.state;
    const { files } = this.props;

    if (source) {
      const sortedFiles = sortFiles(files, sortOrder, filterText)
        .filter(file => file.name.indexOf(filterText) > -1)
        .map((f, i) => i);

      this.setState({
        selectedIndicesSource: new Set(sortedFiles)
      });
    } else {
      this.setState({
        selectedIndicesOutbound: new Set(outboundFiles.map((f, i) => i))
      });
    }
  }

  handleKeyDown(isSource, event) {
    if (isSource) {
      const { selectedIndicesSource, filterText } = this.state;
      const { files } = this.props;

      const isAllSelected = selectedIndicesSource.size === files.length;
      const highestIndex = Math.max.apply(
        Math,
        Array.from(selectedIndicesSource.values())
      );
      const isLastSelected =
        highestIndex ===
        files.filter(file => file.name.indexOf(filterText) > -1).length - 1;

      if (!isAllSelected && !isLastSelected) {
        this.handleUpdateIndicesSource(new Set([highestIndex + 1]));
        event.preventDefault();
      }
    } else {
      const { selectedIndicesOutbound, outboundFiles } = this.state;

      const isAllSelected =
        outboundFiles.length === selectedIndicesOutbound.size;
      const highestIndex = Math.max.apply(
        Math,
        Array.from(selectedIndicesOutbound.values())
      );
      const isLastSelected = highestIndex === outboundFiles.length - 1;

      if (!isAllSelected && !isLastSelected) {
        this.handleUpdateIndicesOutbound(new Set([highestIndex + 1]));
        event.preventDefault();
      }
    }
  }

  handleKeyUp(isSource, event) {
    if (isSource) {
      const { selectedIndicesSource, filterText } = this.state;
      const { files } = this.props;

      const isAllSelected =
        selectedIndicesSource.size ===
        files.filter(file => file.name.indexOf(filterText) > -1).length;
      const lowestIndex = Math.min.apply(
        Math,
        Array.from(selectedIndicesSource.values())
      );
      const isFirstSelected = lowestIndex === 0;

      if (!isAllSelected && !isFirstSelected) {
        event.preventDefault();
        this.handleUpdateIndicesSource(new Set([lowestIndex - 1]));
      }
    } else {
      const { selectedIndicesOutbound, outboundFiles } = this.state;

      const isAllSelected =
        outboundFiles.length === selectedIndicesOutbound.size;

      const lowestIndex = Math.max.apply(
        Math,
        Array.from(selectedIndicesOutbound.values())
      );
      const isFirstSelected = lowestIndex === 0;

      if (!isAllSelected && !isFirstSelected) {
        event.preventDefault();
        this.handleUpdateIndicesOutbound(new Set([lowestIndex - 1]));
      }
    }
  }

  handleSortByExt() {
    const { sortOrder } = this.state;
    this.setState({
      sortOrder: {
        ext: sortOrder.ext === 2 ? 0 : sortOrder.ext + 1,
        name: 0,
        date: 0,
        size: 0
      }
    });
  }

  handleSortByName() {
    const { sortOrder } = this.state;
    this.setState({
      sortOrder: {
        name: sortOrder.name === 2 ? 0 : sortOrder.name + 1,
        ext: 0,
        date: 0,
        size: 0
      }
    });
  }

  handleSortBySize() {
    const { sortOrder } = this.state;
    this.setState({
      sortOrder: {
        size: sortOrder.size === 2 ? 0 : sortOrder.size + 1,
        ext: 0,
        date: 0,
        name: 0
      }
    });
  }

  handleSortByDate() {
    const { sortOrder } = this.state;
    this.setState({
      sortOrder: {
        date: sortOrder.date === 2 ? 0 : sortOrder.date + 1,
        ext: 0,
        name: 0,
        size: 0
      }
    });
  }

  render() {
    const { files, chouetteInfo } = this.props;
    const {
      outboundFiles,
      selectedIndicesOutbound,
      selectedIndicesSource,
      sortOrder,
      filterText
    } = this.state;

    const isLevel1Provider = !!chouetteInfo.migrateDataToProvider;

    const sortedFiles = sortFiles(files, sortOrder, filterText);

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
      cleanStopPlacesChouette: 'Clean Stop place register in Chouette'
    };

    return (
      <div>
        <div style={{ display: 'flex', justfiyContent: 'flex-start' }}>
          {isLevel1Provider ? (
            <>
              <Button
                title={toolTips.import}
                color="primary"
                onClick={() => this.handleImportData(false)}
              >
                Import
              </Button>
              <Button
                title={toolTips.importFlex}
                color="primary"
                style={{ backgroundColor: 'rgb(69, 118, 69)' }}
                onClick={() => this.handleImportData(true)}
              >
                Import flex
              </Button>
            </>
          ) : null}
          <Button
            title={toolTips.validate}
            color="primary"
            onClick={this.handleValidateProvider}
          >
            Validate
          </Button>
          {isLevel1Provider ? (
            <Button
              title={toolTips.transfer}
              color="primary"
              onClick={this.handleTransferData}
            >
              Transfer
            </Button>
          ) : (
            <Button
              title={toolTips.export}
              color="primary"
              onClick={this.handleExportData}
            >
              Export
            </Button>
          )}
          <Button
            title={toolTips.clearEventHistory}
            color="danger"
            onClick={this.handleClearHistory}
          >
            Clear history
          </Button>
          <Button
            title={toolTips.clean}
            color="danger"
            onClick={this.handleCleanDataspace}
          >
            Clean
          </Button>
        </div>
        {isLevel1Provider ? (
          <TextField
            hintText="Filter ..."
            value={filterText}
            onChange={e => this.setState({ filterText: e.target.value })}
          />
        ) : (
          <div
            style={{
              fontWeight: 600,
              marginTop: 20,
              width: '100%',
              textAlign: 'center'
            }}
          >
            Level 2 provider
          </div>
        )}
        {isLevel1Provider ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AdvancedFileList
              selectedIndices={selectedIndicesSource}
              updateIndices={this.handleUpdateIndicesSource.bind(this)}
              downloadButton
              activeProviderId={this.props.activeId}
              files={sortedFiles}
              isSource
              handleSortBySize={this.handleSortBySize.bind(this)}
              handleSortByName={this.handleSortByName.bind(this)}
              handleSortByDate={this.handleSortByDate.bind(this)}
              handleSortByExt={this.handleSortByExt.bind(this)}
              handleKeyDown={this.handleKeyDown.bind(this)}
              handleKeyUp={this.handleKeyUp.bind(this)}
              handleSelectAllShowingIndices={this.handleSelectAllShowingIndices.bind(
                this
              )}
            />
            {sortedFiles.length ? (
              <div
                style={{
                  display: 'flex',
                  alignItem: 'center',
                  flexDirection: 'column',
                  flex: 0.1,
                  cursor: 'pointer'
                }}
              >
                <FaAdd
                  style={{
                    transform: 'scale(2)',
                    color: '#2196f3',
                    marginBottom: 30,
                    marginLeft: 20,
                    marginRight: 20
                  }}
                  onClick={this.appendSelectedFiles.bind(this)}
                />
                <FaRemove
                  style={{
                    transform: 'scale(2)',
                    color: outboundFiles.length ? '#b91c1c' : '#9e9e9e',
                    marginLeft: 20,
                    marginRight: 20
                  }}
                  onClick={this.removeSelectedFiles.bind(this)}
                />
              </div>
            ) : (
              <div style={{ margin: 20, fontWeight: 600 }}>
                No files available
              </div>
            )}
            <AdvancedFileList
              selectedIndices={selectedIndicesOutbound}
              files={outboundFiles}
              updateIndices={this.handleUpdateIndicesOutbound.bind(this)}
              handleKeyDown={this.handleKeyDown.bind(this)}
              handleKeyUp={this.handleKeyUp.bind(this)}
              handleSortByDate={this.handleSortOutboundFiles.bind(this)}
              handleSelectAllShowingIndices={this.handleSelectAllShowingIndices.bind(
                this
              )}
            />
            <div
              style={{
                flex: 0.2,
                display: outboundFiles.length ? 'flex' : 'none',
                alignItems: 'center',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
            >
              <FaArrowDown
                style={{
                  transform: 'scale(2)',
                  marginBottom: 30,
                  marginLeft: 20
                }}
                onClick={this.moveDown}
              />
              <FaArrowUp
                style={{ transform: 'scale(2)', marginLeft: 20 }}
                onClick={this.moveUp}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  handleImportData = (isFlex = false) => {
    const { dispatch, activeId, providers } = this.props;
    const { outboundFiles } = this.state;
    const provider = providers.find(p => p.id === activeId);

    if (outboundFiles.length && provider) {
      if (
        provider.chouetteInfo &&
        provider.chouetteInfo.enableCleanImport &&
        outboundFiles.length > 1
        // TODO: enableCleanImport is removed, hva skjer her?
        //  Can we import multiple files now?
      ) {
        alert(
          'Clean before import enabled, does not make sense to import multiple files'
        );
      } else {
        const { getToken } = this.props;
        dispatch(
          SuppliersActions.importData(
            this.props.activeId,
            outboundFiles,
            isFlex,
            getToken
          )
        );
      }
    } else {
      alert('No files added to import');
    }
  };

  handleExportData = () => {
    this.props.dispatch(SuppliersActions.exportData(this.props.activeId));
  };

  handleTransferData = () => {
    this.props.dispatch(SuppliersActions.transferData(this.props.activeId));
  };

  handleCleanDataspace = () => {
    const response = window.confirm(
      'Are you sure you want to clean up the dataspace current provider?'
    );
    if (response === true) {
      const { dispatch } = this.props;
      dispatch(SuppliersActions.cleanDataspace(this.props.activeId));
    }
  };

  handleClearHistory = () => {
    const response = window.confirm(
      'Are you sure you want to clear event history for current provider?'
    );
    if (response === true) {
      const { dispatch } = this.props;
      const { getToken } = this.props;
      dispatch(
        SuppliersActions.deleteJobsForProvider(this.props.activeId, getToken)
      );
    }
  };

  handleValidateProvider = () => {
    this.props.dispatch(SuppliersActions.validateProvider(this.props.activeId));
  };

  moveDown = () => {
    const { outboundFiles, selectedIndicesOutbound } = this.state;

    const updatedIndices = new Set();

    const maxValue = Math.max.apply(
      Math,
      Array.from(selectedIndicesOutbound.values())
    );

    if (maxValue >= outboundFiles.length - 1) return;

    selectedIndicesOutbound.forEach(value => {
      if (value > -1) {
        outboundFiles.splice(value + 1, 0, outboundFiles.splice(value, 1)[0]);
        updatedIndices.add(value + 1);
      } else {
        updatedIndices.add(value);
      }
    });

    this.setState({
      outboundFiles: outboundFiles,
      selectedIndicesOutbound: updatedIndices
    });
  };

  moveUp = () => {
    const { outboundFiles, selectedIndicesOutbound } = this.state;

    const updatedIndices = new Set();

    const minIndex = Math.min.apply(
      Math,
      Array.from(selectedIndicesOutbound.values())
    );

    if (!minIndex) return;

    selectedIndicesOutbound.forEach(value => {
      if (value) {
        outboundFiles.splice(value - 1, 0, outboundFiles.splice(value, 1)[0]);
        updatedIndices.add(value - 1);
      } else {
        updatedIndices.add(value);
      }
    });

    this.setState({
      outboundFiles: outboundFiles,
      selectedIndicesOutbound: updatedIndices
    });
  };

  appendSelectedFiles = () => {
    let {
      selectedIndicesSource,
      sortOrder,
      filterText,
      outboundFiles
    } = this.state;

    if (!selectedIndicesSource.size) return;

    const { files } = this.props;

    const sortedFiles = sortFiles(files, sortOrder, filterText);

    const filestoAppend = Array.from(selectedIndicesSource).map(
      i => sortedFiles[i]
    );

    const updateOutboundFiles = Array.from(
      new Set(outboundFiles.concat(filestoAppend))
    );

    this.setState({
      outboundFiles: updateOutboundFiles,
      selectedIndicesSource: new Set()
    });
  };

  removeSelectedFiles = () => {
    const { outboundFiles, selectedIndicesOutbound } = this.state;

    let filteredList = [];

    outboundFiles.forEach((file, index) => {
      let indices = Array.from(selectedIndicesOutbound);
      if (indices.indexOf(index) === -1) {
        filteredList.push(file);
      }
    });

    this.setState({
      outboundFiles: filteredList,
      selectedIndicesOutbound: new Set()
    });
  };
}

const mapStateToProps = state => ({
  providers: state.SuppliersReducer.data,
  activeId: state.SuppliersReducer.activeId,
  fileListIsLoading: state.MardukReducer.filenames.isLoading,
  statusList: state.SuppliersReducer.statusList,
  filter: state.MardukReducer.chouetteJobFilter,
  chouetteInfo: state.UtilsReducer.supplierForm.chouetteInfo,
  files: state.MardukReducer.filenames.data || [],
  importIsLoading: state.MardukReducer.isLoading,
  importError: state.MardukReducer.error
});

export default connect(mapStateToProps)(withAuth(DataMigrationDetails));
