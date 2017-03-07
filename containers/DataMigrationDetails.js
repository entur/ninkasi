import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import Button from 'muicss/lib/react/button'
import SuppliersActions from '../actions/SuppliersActions'
const FaArrowDown = require('react-icons/lib/fa/arrow-down')
const FaArrowUp = require('react-icons/lib/fa/arrow-up')
const FaRemove = require('react-icons/lib/fa/arrow-left')
const FaAdd = require('react-icons/lib/fa/arrow-right')
import AdvancedFileList from '../components/AdvancedFileList'
import _ from 'underscore'
import TextField from 'material-ui/TextField'


class DataMigrationDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      outboundFiles: [],
      selectedIndicesOutbound: new Set(),
      selectedIndicesSource: new Set(),
      sortOrder: {
        ext: 0,
        name: 0,
        size: 0,
        date: 0
      },
      filterText: ''
    }
  }

  handleUpdateIndicesSource(indices) {
    this.setState({
      selectedIndicesSource: indices
    })
  }

  handleUpdateIndicesOutbound(indices) {
    this.setState({
      selectedIndicesOutbound: indices
    })
  }

  handleSelectAllShowingIndices(source) {

    const { outboundFiles, filterText } = this.state
    const { files } = this.props

    if (source) {

      const sortedFiles = this.sortFiles(files).filter( file => {
        if (file.name.indexOf(filterText) > -1) return file
      }).map( (f, i) => i)

      this.setState({
        selectedIndicesSource: new Set(sortedFiles)
      })


    } else {
      this.setState({
        selectedIndicesOutbound: new Set(outboundFiles.map( (f, i) => i))
      })
    }
  }

  handleKeyDown(isSource, event) {

    if (isSource) {

      const { selectedIndicesSource, filterText } = this.state
      const { files } = this.props

      const isAllSelected = selectedIndicesSource.size === files.length
      const highestIndex = Math.max.apply(Math, Array.from(selectedIndicesSource.values()))
      const isLastSelected = highestIndex == (files.filter( file => {
          if (file.name.indexOf(filterText) > -1) return file
        }).length -1)

      if (!isAllSelected && !isLastSelected) {
        this.handleUpdateIndicesSource(new Set([highestIndex+1]))
        event.preventDefault()
      }
    } else {

      const { selectedIndicesOutbound, outboundFiles } = this.state

      const isAllSelected = outboundFiles.length == selectedIndicesOutbound.size
      const highestIndex = Math.max.apply(Math, Array.from(selectedIndicesOutbound.values()))
      const isLastSelected = highestIndex == (outboundFiles.length -1)


      if (!isAllSelected && !isLastSelected) {
        this.handleUpdateIndicesOutbound(new Set([highestIndex+1]))
        event.preventDefault()
      }
    }
  }

  handleKeyUp(isSource, event) {

    if (isSource) {

      const { selectedIndicesSource, filterText } = this.state
      const { files } = this.props

      const isAllSelected = selectedIndicesSource.size === files.filter( file => {
        if (file.name.indexOf(filterText) > -1) return file
      }).length
      const lowestIndex = Math.min.apply(Math, Array.from(selectedIndicesSource.values()))
      const isFirstSelected = lowestIndex == 0

      if (!isAllSelected && !isFirstSelected) {
        event.preventDefault()
        this.handleUpdateIndicesSource(new Set([lowestIndex-1]))
      }
    } else {

      const { selectedIndicesOutbound, outboundFiles } = this.state

      const isAllSelected = outboundFiles.length == selectedIndicesOutbound.size

      const lowestIndex = Math.max.apply(Math, Array.from(selectedIndicesOutbound.values()))
      const isFirstSelected = lowestIndex == 0

      if (!isAllSelected && !isFirstSelected) {
        event.preventDefault()
        this.handleUpdateIndicesOutbound(new Set([lowestIndex - 1]))
      }

    }
  }

  handleSortByExt() {
    const { sortOrder } = this.state
    this.setState({
      sortOrder: {
        ext: sortOrder.ext == 2 ? 0 : sortOrder.ext+1,
        name: 0,
        date: 0,
        size: 0,
      }
    })
  }

  handleSortByName() {
    const { sortOrder } = this.state
    this.setState({
      sortOrder: {
        name: sortOrder.name == 2 ? 0 : sortOrder.name+1,
        ext: 0,
        date: 0,
        size: 0,
      }
    })
  }

  handleSortBySize() {
    const { sortOrder } = this.state
    this.setState({
      sortOrder: {
        size: sortOrder.size == 2 ? 0 : sortOrder.size+1,
        ext: 0,
        date: 0,
        name: 0
      }
    })
  }

  handleSortByDate() {
    const { sortOrder } = this.state
    this.setState({
      sortOrder: {
        date: sortOrder.date == 2 ? 0 : sortOrder.date+1,
        ext: 0,
        name: 0,
        size: 0
      }
    })
  }

  sortFiles() {

    const { sortOrder, filterText } = this.state
    const unsortedFile = this.props.files

    let files = unsortedFile.slice()

    let sortedFiles = !sortOrder.ext
      ? _.sortBy(files, file => new Date(file.updated))
      : (sortOrder.ext == 1
          ? _.sortBy(files, file => file.ext)
          : _.sortBy(files, file => file.ext).reverse()
      )

    sortedFiles = !sortOrder.name
      ? sortedFiles
      : (sortOrder.name == 1
          ? _.sortBy(files, file => file.name)
          : _.sortBy(files, file => file.name).reverse()
      )

    sortedFiles = !sortOrder.size
      ? sortedFiles
      : (sortOrder.size == 1
          ? _.sortBy(files, file => file.fileSize)
          : _.sortBy(files, file => file.fileSize).reverse()
      )

    sortedFiles = !sortOrder.date
      ? sortedFiles
      : (sortOrder.date == 1
          ? _.sortBy(files, file => new Date(file.updated))
          : _.sortBy(files, file => new Date(file.updated)).reverse()
      )

    return sortedFiles.filter( file => {
      if (file.name.indexOf(filterText) > -1) return file
    })
  }

  render() {

    const { files, chouetteInfo } = this.props
    const { outboundFiles, selectedIndicesOutbound, selectedIndicesSource, filterText } = this.state

    const shouldRenderTransfer = !!chouetteInfo.migrateDataToProvider

    const sortedFiles = this.sortFiles(files)

    const toolTips = {
      import: 'Import all files listed in the list on the right side below. Files will be imported in the given order. If success, VALIDATE will be called',
      validate: 'Validate data in dataspace. If success, TRANSFER will be called if in level 1 space or EXPORT if in level 2 space',
      transfer: 'Transfer data from this space to the next space (Rutebanken space with id ' + chouetteInfo.migrateDataToProvider+ '). If success, VALIDATE in level 2 space will be called',
      export: 'Export GTFS data and trigger bulding',
      clean: 'Clean data space (delete ALL transport data)'
    }

    return (

      <div>
        <div style={{display: 'flex', justfiyContent: 'flex-start'}}>
          <Button title={toolTips.import} color="primary" onClick={this.handleImportData}>Import</Button>
          <Button title={toolTips.validate} color="primary" onClick={this.handleValidateProvider}>Validate</Button>
          { shouldRenderTransfer
            ? <Button title={toolTips.transfer} color="primary" onClick={this.handleTransferData}>Transfer</Button>
            : <Button title={toolTips.export} color="primary" onClick={this.handleExportData}>Export</Button>
          }
          <Button title={toolTips.clean} color="danger" onClick={this.handleCleanDataspace}>Clean</Button>
        </div>
        <TextField
          hintText="Filter ..."
          value={filterText}
          onChange={ e => this.setState({filterText: e.target.value})}
        />
        <div style={{display: 'flex', alignItems: 'center'}}>
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
            handleSelectAllShowingIndices={this.handleSelectAllShowingIndices.bind(this)}
          />
          { sortedFiles.length
            ?
            <div style={{display: 'flex', alignItem: 'center', flexDirection: 'column', flex: 0.1, cursor: 'pointer'}}>
              <FaAdd style={{transform: 'scale(2)', color: '#2196f3', marginBottom: 30, marginLeft: 20, marginRight: 20}} onClick={this.appendSelectedFiles}/>
              <FaRemove style={{transform: 'scale(2)', color: outboundFiles.length ? '#b91c1c' : '#9e9e9e', marginLeft: 20, marginRight: 20}} onClick={this.removeSelectedFiles}/>
            </div>
            : <div style={{margin: 20, fontWeight: 600}}>No files available</div>
          }
          <AdvancedFileList
            selectedIndices={selectedIndicesOutbound}
            files={outboundFiles}
            updateIndices={this.handleUpdateIndicesOutbound.bind(this)}
            handleKeyDown={this.handleKeyDown.bind(this)}
            handleKeyUp={this.handleKeyUp.bind(this)}
            handleSelectAllShowingIndices={this.handleSelectAllShowingIndices.bind(this)}
          />
          <div style={{flex: 0.2, display: outboundFiles.length ? 'flex' : 'none', alignItems: 'center', flexDirection: 'column', cursor: 'pointer'}}>
            <FaArrowDown style={{transform: 'scale(2)', marginBottom: 30, marginLeft: 20}} onClick={this.moveDown}/>
            <FaArrowUp style={{transform: 'scale(2)', marginLeft: 20}} onClick={this.moveUp}/>
          </div>
        </div>
      </div>
    )
  }


  handleImportData = () => {
    const { dispatch } = this.props
    const { outboundFiles } = this.state

    if (outboundFiles.length) {
      dispatch(SuppliersActions.importData(this.props.activeId, outboundFiles))
    } else {
      alert("No files added to import")
    }
  }


  handleExportData = () => {
    this.props.dispatch(SuppliersActions.exportData(this.props.activeId))
  }

  handleTransferData = () => {
    this.props.dispatch(SuppliersActions.transferData(this.props.activeId))
  }

  handleCleanDataspace = () => {
    const response = confirm("Are you sure you want to clean up the dataspace current provider?")
    if (response == true) {
      const {dispatch} = this.props
      dispatch(SuppliersActions.cleanDataspace(this.props.activeId))
    }
  }

  handleValidateProvider = () => {
    this.props.dispatch(SuppliersActions.validateProvider(this.props.activeId))
  }

  moveDown = () => {

    const { outboundFiles, selectedIndicesOutbound } = this.state

    const updatedIndices = new Set()

    const maxValue = Math.max.apply(Math, Array.from(selectedIndicesOutbound.values()))

    if (maxValue >= outboundFiles.length-1) return

    selectedIndicesOutbound.forEach( value => {
      if (value > -1) {
        outboundFiles.splice(value+1, 0, outboundFiles.splice(value, 1)[0])
        updatedIndices.add(value+1)
      } else {
        updatedIndices.add(value)
      }

    })

    this.setState({
      outboundFiles: outboundFiles,
      selectedIndicesOutbound: updatedIndices
    })

  }

  moveUp = () => {

    const { outboundFiles, selectedIndicesOutbound } = this.state

    const updatedIndices = new Set()

    const minIndex = Math.min.apply(Math, Array.from(selectedIndicesOutbound.values()))

    if (!minIndex) return

    selectedIndicesOutbound.forEach( value => {
      if (value) {
        outboundFiles.splice(value-1, 0, outboundFiles.splice(value, 1)[0])
        updatedIndices.add(value-1)
      } else {
        updatedIndices.add(value)
      }

    })

    this.setState({
      outboundFiles: outboundFiles,
      selectedIndicesOutbound: updatedIndices
    })

  }

  appendSelectedFiles = () => {

    let { selectedIndicesSource, outboundFiles } = this.state

    if (!selectedIndicesSource.size) return

    const { files } = this.props

    const sortedFiles = this.sortFiles(files.slice(0))

    const filestoAppend = Array.from(selectedIndicesSource).map( i => sortedFiles[i])

    const updateOutboundFiles = Array.from(new Set(outboundFiles.concat(filestoAppend)))

    this.setState({
      outboundFiles: updateOutboundFiles,
      selectedIndicesSource: new Set()
    })

  }

  removeSelectedFiles = () => {

    const { outboundFiles, selectedIndicesOutbound  } = this.state

    let filteredList = []

    outboundFiles.forEach( (file, index) => {
      let indices = Array.from(selectedIndicesOutbound)
      if (indices.indexOf(index) == -1) {
        filteredList.push(file)
      }
    })

    this.setState({
      outboundFiles: filteredList,
      selectedIndicesOutbound: new Set()
    })

  }
}

const mapStateToProps = (state, ownProps, ownState) => {

  return {
    providers: state.SuppliersReducer.data,
    activeId: state.SuppliersReducer.activeId,
    filelistIsLoading: state.MardukReducer.filenames.isLoading,
    statusList: state.SuppliersReducer.statusList,
    filter: state.MardukReducer.chouetteJobFilter,
    chouetteInfo: state.UtilsReducer.supplierForm.chouetteInfo,
    files: state.MardukReducer.filenames.data || []
  }
}

export default connect(mapStateToProps,)(DataMigrationDetails)
