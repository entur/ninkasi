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

class OrganizationFilter extends Component {
  render() {
    const {
      organizations = [],
      handleOnChange,
      organisationFilterId
    } = this.props;

    const options = [
      {
        id: -1,
        value: -1,
        name: 'All organisations'
      },
      ...organizations
    ];

    return (
      <select
        style={{ marginLeft: 5 }}
        value={organisationFilterId}
        onChange={e => handleOnChange(e.target.value)}
      >
        {options.map(org => (
          <option value={org.id} key={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    );
  }
}

export default OrganizationFilter;
