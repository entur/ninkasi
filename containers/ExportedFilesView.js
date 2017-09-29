import React, {Component} from 'react';
import { connect } from 'react-redux';
import SuppliersActions from '../actions/SuppliersActions';

class ExportedFilesView extends Component {

  componentDidMount() {
    this.props.dispatch(SuppliersActions.getExportedFiles());
  }

  render() {

    const { files } = this.props;

    if (!files) return null;

    const { gtfs, other, netex, graph } = files;

    return (
      <div>
        GTFS: { gtfs.length }
        NETEX: { netex.length }
        Graph: { graph.length }
        Other: { other.length }
      </div>
    );
  }
}

const mapStateToProps = ({SuppliersReducer}) => ({
  files: SuppliersReducer.exportedFiles
});

export default connect(mapStateToProps)(ExportedFilesView);
