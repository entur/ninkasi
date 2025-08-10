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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import withAuth from 'utils/withAuth';
import SuppliersActions from 'actions/SuppliersActions';
import ExportedFilesRow from './ExportedFilesRow';
import ExportedFilesHeader from './ExportedFilesHeader';

class ExportedFilesView extends Component {
  componentDidMount() {
    this.props.dispatch(SuppliersActions.getExportedFiles(this.props.getToken));
  }

  render() {
    const { files, providers } = this.props;

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
            providerId={p}
          />
        ))}
      </div>
    );
  }
}

const mapProviderIdToKeys = data => {
  if (data && data.length) {
    const providerIdKeys = {};
    data.forEach(provider => {
      if (provider.chouetteInfo && provider.chouetteInfo.referential) {
        providerIdKeys[provider.chouetteInfo.referential] = provider.name;
      }
    });
    return providerIdKeys;
  }
  return null;
};

const mapStateToProps = ({ SuppliersReducer }) => ({
  files: SuppliersReducer.exportedFiles,
  providers: mapProviderIdToKeys(SuppliersReducer.data),
});

export default connect(mapStateToProps)(withAuth(ExportedFilesView));
