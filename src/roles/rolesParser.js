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

rolesParser.canEditOrganisation = tokenParsed => {
  if (!tokenParsed || !tokenParsed.roles) return false;

  let canEditOrganisation = false;

  tokenParsed.roles.forEach(roleString => {
    let roleJSON = JSON.parse(roleString);
    if (roleJSON.r === "editOrganisation") {
      canEditOrganisation = true;
    }
  });
  return canEditOrganisation;
};

rolesParser.getUserProviders = (tokenParsed, providers) => {
  if (!tokenParsed || !tokenParsed.roles) return [];

  let allowedOrganisations = [];
  let isAdmin = false;

  tokenParsed.roles.forEach(roleString => {
    let roleJSON = JSON.parse(roleString);
    if (roleJSON.r === "editRouteData") {
      allowedOrganisations.push(roleJSON.o);
    } else if (roleJSON.r === "adminEditRouteData") {
      isAdmin = true;
    }
  });

  let userOrganisations = [];

  if (isAdmin) return providers;

  providers.forEach(org => {
    if (
      org.sftpAccount &&
      allowedOrganisations.indexOf(org.sftpAccount.toUpperCase()) > -1
    )
      userOrganisations.push(org);
  });

  return userOrganisations;
};

rolesParser.isAdmin = tokenParsed => {
  if (!tokenParsed || !tokenParsed.roles) return false;

  for (let i = 0; i < tokenParsed.roles.length; i++) {
    let role = JSON.parse(tokenParsed.roles[i]);
    if (role.r === "adminEditRouteData") return true;
  }

  return false;
};

export default rolesParser;
