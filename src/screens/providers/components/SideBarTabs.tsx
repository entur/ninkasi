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

import SideBarTabsElement from './SideBarTabsElement';

interface Props {
  activeTab: number;
  setActiveTab: (value: number) => void;
}

const SideBarTabs = ({ activeTab, setActiveTab }: Props) => {
  const style: React.CSSProperties = {
    maxWidth: 120,
    fontSize: '0.9em',
    marginRight: 10,
  };

  return (
    <div style={style}>
      <SideBarTabsElement label="Users" active={activeTab === 0} onClick={() => setActiveTab(0)} />
      <SideBarTabsElement
        label="M2M Clients"
        active={activeTab === 1}
        onClick={() => setActiveTab(1)}
      />
      <SideBarTabsElement
        label="Organizations"
        active={activeTab === 2}
        onClick={() => setActiveTab(2)}
      />
      <SideBarTabsElement label="Roles" active={activeTab === 3} onClick={() => setActiveTab(3)} />
      <SideBarTabsElement
        label="Responsibility sets"
        active={activeTab === 4}
        onClick={() => setActiveTab(4)}
      />
      <SideBarTabsElement
        label="Entity types"
        active={activeTab === 5}
        onClick={() => setActiveTab(5)}
      />
    </div>
  );
};

export default SideBarTabs;
