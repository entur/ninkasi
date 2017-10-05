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

    const { files, providers } = this.props;

    if (!files) return null;

    const { providerData, norwayGTFS, norwayNetex } = files;

    return (
      <div>
        <ExportedFilesHeader/>
          <ExportedFilesRow
            key={'files-row-all'}
            index={-1}
            referential={'Norway'}
            providerName={'Norway (aggregated)'}
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
            providerName={providers[providerData[p].referential] || 'N/A'}
            referential={providerData[p].referential}
            data={providerData[p]}
            providerId={p}
          />
        )) }
      </div>
    );
  }
}

const mapProviderIdToKeys = data => {
  if (data && data.length) {
    let providerIdKeys = {};
    data.forEach( provider => {
      if (provider.chouetteInfo && provider.chouetteInfo.referential) {
        providerIdKeys[provider.chouetteInfo.referential] = provider.name;
      }
    });
    return providerIdKeys;
  }
  return null;
};

const mapStateToProps = ({SuppliersReducer}) => ({
  files: SuppliersReducer.exportedFiles,
  providers: mapProviderIdToKeys(SuppliersReducer.data),
});



export default connect(mapStateToProps)(ExportedFilesView);
