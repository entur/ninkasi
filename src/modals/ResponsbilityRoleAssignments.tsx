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

import { Box } from '@mui/material';
import {
  getEntityClassificationRefString,
  getOrganizationNameByRef,
  getAdminZoneNameByRef,
} from 'utils/index';

interface ResponsbilityRoleAssignmentsProps {
  roleAssignments: any[];
  organizations: any[];
  adminZones: any[];
}

const ResponsbilityRoleAssignments = ({
  roleAssignments,
  organizations,
  adminZones,
}: ResponsbilityRoleAssignmentsProps) => {
  const columnSx = {
    flexBasis: '100%',
    fontSize: 12,
    alignItems: 'flex-start',
    flex: 1,
  };

  const itemSx = {
    alignSelf: 'flex-start',
    flexBasis: '100%',
    fontSize: 12,
    flex: 1,
  };

  return (
    <Box>
      <Box>
        <Box sx={{ display: 'flex', fontSize: 12, fontWeight: 600 }}>
          <Box sx={columnSx}>Type</Box>
          <Box sx={columnSx}>Organisation</Box>
          <Box sx={columnSx}>Area</Box>
          <Box sx={{ ...columnSx, flex: 2 }}>Entity class</Box>
        </Box>
        {roleAssignments.map(role => (
          <Box key={'resp-role-' + role.id} sx={{ display: 'flex' }}>
            <Box sx={itemSx}> {role.typeOfResponsibilityRoleRef}</Box>
            <Box sx={itemSx}>
              {getOrganizationNameByRef(organizations, role.responsibleOrganisationRef)}
            </Box>
            <Box sx={itemSx}>{getAdminZoneNameByRef(adminZones, role.responsibleAreaRef)}</Box>
            <Box sx={{ ...itemSx, flex: 2 }}>
              <Box
                component="ul"
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  flexDirection: 'column',
                  listStyleType: 'none',
                }}
              >
                {role.entityClassificationAssignments &&
                  role.entityClassificationAssignments.map((assignment: any, i: number) => (
                    <li key={i}>
                      {getEntityClassificationRefString(
                        assignment.entityClassificationRef,
                        assignment.allow
                      )}
                    </li>
                  ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ResponsbilityRoleAssignments;
