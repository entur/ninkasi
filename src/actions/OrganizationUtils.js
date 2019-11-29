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

export const removeRedundantActions = (
  actions,
  jobDomain,
  jobDomainActions
) => {
  if (!actions || !actions.length) return [];

  let asteriskFound = actions.indexOf("*") > -1;

  if (asteriskFound) {
    return ["*"];
  }

  // -1 because * is included in allActions
  if (actions.length >= jobDomainActions[jobDomain].length - 1) {
    return ["*"];
  }

  return actions;
};

export const formatUserNotifications = (
  userNotifications,
  jobDomainActions
) => {
  return userNotifications.map(userNotification => {
    if (userNotification.isNew) {
      delete userNotification.isNew;
    }

    if (userNotification.eventFilter.type === "JOB") {
      if (userNotification.eventFilter.administrativeZoneRefs) {
        delete userNotification.eventFilter.administrativeZoneRefs;
      }
      if (userNotification.eventFilter.entityClassificationRefs) {
        delete userNotification.eventFilter.entityClassificationRefs;
      }

      userNotification.eventFilter.actions = removeRedundantActions(
        userNotification.eventFilter.actions,
        userNotification.eventFilter.jobDomain,
        jobDomainActions
      );
    } else if (userNotification.eventFilter.type === "CRUD") {
      if (!userNotification.eventFilter.administrativeZoneRefs) {
        userNotification.eventFilter.administrativeZoneRefs = [];
      }
      if (!userNotification.eventFilter.entityClassificationRefs) {
        userNotification.eventFilter.entityClassificationRefs = [];
      }
    }
    return userNotification;
  });
};
