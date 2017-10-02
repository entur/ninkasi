import React, {Component} from 'react';
import { connect } from 'react-redux';
import SuppliersActions from '../actions/SuppliersActions';
import ExportedFilesRow from '../components/ExportedFilesRow';
import ExportedFilesHeader from '../components/ExportedFilesHeader'

class ExportedFilesView extends Component {

  componentDidMount() {
    this.props.dispatch(SuppliersActions.getExportedFiles());
  }

  render() {

    const { files } = this.props;

    if (!files) return null;

    const { providerData, norwayGTFS, norwayNetex } = files;

    return (
      <div>
        <ExportedFilesHeader/>
          <ExportedFilesRow
            key={'files-row-all'}
            index={-1}
            referential={'Norway'}
            data={{
              GTFS: norwayGTFS.slice(0,1),
              NETEX: norwayNetex.slice(0,1)
            }}
            providerId={-1}
          />
        { Object.keys(providerData).map( (p, i) => (
          <ExportedFilesRow
            key={'files-row-' + p}
            index={i}
            referential={providerData[p].referential}
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
