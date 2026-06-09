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

import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

interface Organization {
  id: string;
  name: string;
}

interface NotificationLike {
  eventFilter: {
    organisationRef?: string;
  };
}

interface OrganisationSelectProps {
  organizations: Organization[];
  notification: NotificationLike;
  handleChangeOrganization: (value: string) => void;
}

const OrganisationSelect = ({
  organizations,
  notification,
  handleChangeOrganization,
}: OrganisationSelectProps) => (
  <FormControl style={{ marginLeft: 16, flex: 1 }} margin="normal">
    <InputLabel id="notification-org-label">Organization</InputLabel>
    <Select
      labelId="notification-org-label"
      label="Organization"
      value={notification.eventFilter.organisationRef ?? ''}
      onChange={e => {
        handleChangeOrganization(e.target.value as string);
      }}
    >
      {organizations.map(org => (
        <MenuItem key={org.id} value={org.id}>
          {org.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default OrganisationSelect;
