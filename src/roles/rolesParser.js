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

const rolesParser = {};

rolesParser.canEditOrganisation = roleAssignments => {
  if (!roleAssignments) return false;

  let canEditOrganisation = false;

  roleAssignments.forEach(roleString => {
    let roleJSON = JSON.parse(roleString);
    if (roleJSON.r === 'editOrganisation') {
      canEditOrganisation = true;
    }
  });
  return canEditOrganisation;
};

rolesParser.isAdmin = roleAssignments => {
  if (!roleAssignments) return false;

  for (let i = 0; i < roleAssignments.length; i++) {
    let role = JSON.parse(roleAssignments[i]);
    if (role.r === 'adminEditRouteData') return true;
  }

  return false;
};

export default rolesParser;
