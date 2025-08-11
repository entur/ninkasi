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
import { connect } from 'react-redux';
import withAuth from '../../utils/withAuth';
import SideBarTabs from '../providers/components/SideBarTabs';
import UserView from '../providers/components/userView/UserView';
import OrganizationView from '../providers/components/organizationView/OrganizationView';
import RoleView from '../providers/components/roleView/RoleView';
import ResponsibilitiesView from '../providers/components/responsibilitiesView/ResponsibilitiesView';
import EntityTypesView from '../providers/components/entityTypesView/EntityTypesView';

interface OrganizationProps {
  isOrganisationAdmin: boolean;
}

interface OrganizationState {
  activeTab: number;
}

class Organization extends React.Component<OrganizationProps, OrganizationState> {
  constructor(props: OrganizationProps) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  setActiveTab = (value: number) => {
    this.setState({
      activeTab: value,
    });
  };

  render() {
    const { isOrganisationAdmin } = this.props;

    if (!isOrganisationAdmin) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>You do not have permission to access the Organization register.</p>
        </div>
      );
    }

    const containerStyle: React.CSSProperties = {
      padding: '20px',
      paddingTop: '20px',
    };

    const contentStyle: React.CSSProperties = {
      display: 'flex',
      minHeight: 'calc(100vh - 104px)', // Account for header height and padding
    };

    const { activeTab } = this.state;

    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <SideBarTabs activeTab={activeTab} setActiveTab={this.setActiveTab} />
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
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  isOrganisationAdmin: state.UserContextReducer.isOrganisationAdmin,
});

export default connect(mapStateToProps)(withAuth(Organization));
