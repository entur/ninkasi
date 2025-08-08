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

class ExportedFilesHeader extends Component {
  render() {
    const style = {
      padding: 2,
      border: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      fontWeight: 600,
      background: 'rgb(47, 47, 47)',
      color: '#fff',
    };

    return (
      <div style={style}>
        <div style={{ flex: 2.5 }}>Name</div>
        <div style={{ flex: 1 }}>Referential</div>
        <div style={{ flex: 3 }}>Netex exported</div>
        <div style={{ flex: 1 }}>Netex file</div>
        <div style={{ flex: 3 }}>GTFS exported</div>
        <div style={{ flex: 1 }}>GTFS file</div>
        <div style={{ flex: 1 }}>Difference</div>
        <div style={{ flex: 4 }}>Status</div>
      </div>
    );
  }
}
export default ExportedFilesHeader;
