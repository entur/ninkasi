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

import React from "react";
import {
  getEntityClassificationRefString,
  getOrganizationNameByRef,
  getAdminZoneNameByRef
} from "../utils/index";

class ResponsbilityRoleAssignments extends React.Component {
  render() {
    const { roleAssignments, organizations, adminZones } = this.props;

    const columnStyle = {
      flexBasis: "100%",
      fontSize: 12,
      alignItems: "flex-start",
      flex: 1
    };

    const itemStyle = {
      alignSelf: "flex-start",
      flexBasis: "100%",
      fontSize: 12,
      flex: 1
    };

    return (
      <div>
        <div>
          <div style={{ display: "flex", fontSize: 12, fontWeight: 600 }}>
            <div style={columnStyle}>Type</div>
            <div style={columnStyle}>Organisation</div>
            <div style={columnStyle}>Area</div>
            <div style={{ ...columnStyle, flex: 2 }}>Entity class</div>
          </div>
          {roleAssignments.map(role => (
            <div key={"resp-role-" + role.id} style={{ display: "flex" }}>
              <div style={itemStyle}> {role.typeOfResponsibilityRoleRef}</div>
              <div style={itemStyle}>
                {getOrganizationNameByRef(
                  organizations,
                  role.responsibleOrganisationRef
                )}
              </div>
              <div style={itemStyle}>
                {getAdminZoneNameByRef(adminZones, role.responsibleAreaRef)}
              </div>
              <div style={{ ...itemStyle, flex: 2 }}>
                <ul
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "column",
                    listStyleType: "none"
                  }}
                >
                  {role.entityClassificationAssignments &&
                    role.entityClassificationAssignments.map(
                      (assignment, i) => (
                        <li key={i}>
                          {getEntityClassificationRefString(
                            assignment.entityClassificationRef,
                            assignment.allow
                          )}
                        </li>
                      )
                    )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ResponsbilityRoleAssignments;
