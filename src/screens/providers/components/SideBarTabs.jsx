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
import SideBarTabsElement from './SideBarTabsElement';

class SideBarTabs extends React.Component {
  setActiveTab(value) {
    this.props.setActiveTab(value);
  }

  render() {
    const style = {
      maxWidth: 120,
      fontSize: '0.9em',
      marginRight: 10,
    };

    const { activeTab } = this.props;

    return (
      <div style={style}>
        <SideBarTabsElement
          label="Users"
          active={activeTab === 0}
          onClick={() => this.setActiveTab(0)}
        />
        <SideBarTabsElement
          label="M2M Clients"
          active={activeTab === 1}
          onClick={() => this.setActiveTab(1)}
        />
        <SideBarTabsElement
          label="Organizations"
          active={activeTab === 2}
          onClick={() => this.setActiveTab(2)}
        />
        <SideBarTabsElement
          label="Roles"
          active={activeTab === 3}
          onClick={() => this.setActiveTab(3)}
        />
        <SideBarTabsElement
          label="Responsibility sets"
          active={activeTab === 4}
          onClick={() => this.setActiveTab(4)}
        />
        <SideBarTabsElement
          label="Entity types"
          active={activeTab === 5}
          onClick={() => this.setActiveTab(5)}
        />
      </div>
    );
  }
}

export default SideBarTabs;
