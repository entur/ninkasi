import React, { Component, PropTypes } from 'react';
import {
  getEntityClassificationRefString,
  getOrganizationNameByRef,
  getAdminZoneNameByRef
} from '../utils/index';

class ResponsbilityRoleAssignments extends React.Component {
  render() {
    const { roleAssignments, organizations, adminZones } = this.props;

    const columnStyle = {
      flexBasis: '100%',
      fontSize: 12,
      alignItems: 'flex-start',
      flex: 1
    };

    const itemStyle = {
      alignSelf: 'flex-start',
      flexBasis: '100%',
      fontSize: 12,
      flex: 1
    };

    return (
      <div>
        <div>
          <div style={{ display: 'flex', fontSize: 12, fontWeight: 600 }}>
            <div style={columnStyle}>Type</div>
            <div style={columnStyle}>Organisation</div>
            <div style={columnStyle}>Area</div>
            <div style={{ ...columnStyle, flex: 2 }}>Entity class</div>
          </div>
          {roleAssignments.map(role =>
            <div key={'resp-role-' + role.id} style={{ display: 'flex' }}>
              <div style={itemStyle}> {role.typeOfResponsibilityRoleRef}</div>
              <div style={itemStyle}>
                {getOrganizationNameByRef(
                  organizations,
                  role.responsibleOrganisationRef
                )}
              </div>
              <div style={itemStyle}>{getAdminZoneNameByRef(adminZones, role.responsibleAreaRef)}</div>
              <div style={{ ...itemStyle, flex: 2 }}>
                <ul
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                    listStyleType: 'none'
                  }}
                >
                  {role.entityClassificationAssignments &&
                    role.entityClassificationAssignments.map((assignment, i) =>
                      <li key={i}>
                        {getEntityClassificationRefString(
                          assignment.entityClassificationRef,
                          assignment.allow
                        )}
                      </li>
                    )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ResponsbilityRoleAssignments;
