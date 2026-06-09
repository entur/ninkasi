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
import SideBarTabs from './SideBarTabs';
import UserView from './userView/UserView';
import OrganizationView from './organizationView/OrganizationView';
import RoleView from './roleView/RoleView';
import ResponsibilitiesView from './responsibilitiesView/ResponsibilitiesView';
import EntityTypesView from './entityTypesView/EntityTypesView';

const OrganizationRegister = () => {
  const [activeTab, setActiveTab] = useState(0);

  const style: React.CSSProperties = {
    display: 'flex',
  };

  return (
    <div style={style}>
      <SideBarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div
        style={{
          border: '1px solid rgb(229, 229, 229)',
          flex: 2,
          overflow: 'hidden',
        }}
      >
        {activeTab === 0 ? <UserView /> : null}
        {activeTab === 1 ? <RoleView /> : null}
        {activeTab === 2 ? <OrganizationView /> : null}
        {activeTab === 3 ? <ResponsibilitiesView /> : null}
        {activeTab === 4 ? <EntityTypesView /> : null}
      </div>
    </div>
  );
};

export default OrganizationRegister;
