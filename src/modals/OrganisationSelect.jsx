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

import React from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

class OrganisationSelect extends React.Component {
  static propTypes = {
    organizations: PropTypes.array.isRequired,
    notification: PropTypes.object.isRequired,
    handleChangeOrganization: PropTypes.func.isRequired,
  };

  render() {
    const { organizations, notification, handleChangeOrganization } =
      this.props;

    return (
      <FormControl style={{ marginLeft: 10, flex: 1 }}>
        <Select
          value={notification.eventFilter.organisationRef}
          onChange={(e) => {
            handleChangeOrganization(e.target.value);
          }}
          displayEmpty
        >
          {organizations.map((org) => (
            <MenuItem key={org.id} value={org.id}>
              {org.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default OrganisationSelect;
