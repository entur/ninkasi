import React, {Component} from 'react';
import { connect } from 'react-redux';
import SuppliersActions from '../actions/SuppliersActions';
import ExportedFilesRow from './ExportedFilesRow';
import ExportedFilesHeader from './ExportedFilesHeader'

class ExportedFilesView extends Component {

  componentDidMount() {
    this.props.dispatch(SuppliersActions.getExportedFiles());
  }

  render() {

    const { files } = this.props;

    if (!files) return null;

    const { gtfs, other, netex, graph, providerData } = files;

    return (
      <div>
        <ExportedFilesHeader/>
        { Object.keys(providerData).map( p => (
          <ExportedFilesRow
            key={'files-row-' + p}
            data={providerData[p]}
            providerId={p}
          />
        )) }
      </div>
    );
  }
}

const mapStateToProps = ({SuppliersReducer}) => ({
  files: SuppliersReducer.exportedFiles
});

export default connect(mapStateToProps)(ExportedFilesView);
