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

import { Tabs, Tab } from '@mui/material';

interface Props {
  activeTab: number;
  setActiveTab: (value: number) => void;
}

const labels = [
  'Users',
  'M2M Clients',
  'Organizations',
  'Roles',
  'Responsibility sets',
  'Entity types',
];

const SideBarTabs = ({ activeTab, setActiveTab }: Props) => (
  <Tabs
    orientation="vertical"
    value={activeTab}
    onChange={(_e, value) => setActiveTab(value)}
    aria-label="Organization sections"
    sx={{
      borderRight: 1,
      borderColor: 'divider',
      minWidth: 180,
      mr: 1.25,
      '& .MuiTab-root': {
        alignItems: 'flex-start',
        textAlign: 'left',
      },
    }}
  >
    {labels.map(label => (
      <Tab key={label} label={label} />
    ))}
  </Tabs>
);

export default SideBarTabs;
