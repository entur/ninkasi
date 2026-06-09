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

import { useState } from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import SideBarTabs from '../providers/components/SideBarTabs';
import UserView from '../providers/components/userView/UserView';
import M2MClientsView from '../providers/components/m2mClientsView/M2MClientsView';
import OrganizationView from '../providers/components/organizationView/OrganizationView';
import RoleView from '../providers/components/roleView/RoleView';
import ResponsibilitiesView from '../providers/components/responsibilitiesView/ResponsibilitiesView';
import EntityTypesView from '../providers/components/entityTypesView/EntityTypesView';

const containerSx = {
  padding: '20px',
  paddingTop: '20px',
};

const contentSx = {
  display: 'flex',
  minHeight: 'calc(100vh - 104px)', // header height + padding
};

const Organization = () => {
  const [activeTab, setActiveTab] = useState(0);
  const isOrganisationAdmin = useAppSelector(state => state.UserContextReducer.isOrganisationAdmin);

  if (!isOrganisationAdmin) {
    return (
      <Box sx={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to access the Organization register.</p>
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      <Box sx={contentSx}>
        <SideBarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <Box
          sx={{
            border: '1px solid rgb(229, 229, 229)',
            flex: 2,
            overflow: 'hidden',
          }}
        >
          {activeTab === 0 ? <UserView /> : null}
          {activeTab === 1 ? <M2MClientsView /> : null}
          {activeTab === 2 ? <OrganizationView /> : null}
          {activeTab === 3 ? <RoleView /> : null}
          {activeTab === 4 ? <ResponsibilitiesView /> : null}
          {activeTab === 5 ? <EntityTypesView /> : null}
        </Box>
      </Box>
    </Box>
  );
};

export default Organization;
