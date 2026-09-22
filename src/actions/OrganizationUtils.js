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

export const removeRedundantActions = (actions, jobDomain, jobDomainActions) => {
  if (!actions || !actions.length) return [];

  const asteriskFound = actions.indexOf('*') > -1;

  if (asteriskFound) {
    return ['*'];
  }

  // -1 because * is included in allActions
  if (actions.length >= jobDomainActions[jobDomain].length - 1) {
    return ['*'];
  }

  return actions;
};

const formatEventFilter = (eventFilter, jobDomainActions) => {
  if (eventFilter.type === 'JOB') {
    const { administrativeZoneRefs, entityClassificationRefs, ...baseEventFilter } = eventFilter;
    return {
      ...baseEventFilter,
      actions: removeRedundantActions(eventFilter.actions, eventFilter.jobDomain, jobDomainActions),
    };
  }

  if (eventFilter.type === 'CRUD') {
    return {
      ...eventFilter,
      administrativeZoneRefs: eventFilter.administrativeZoneRefs ?? [],
      entityClassificationRefs: eventFilter.entityClassificationRefs ?? [],
    };
  }

  return eventFilter;
};

export const formatUserNotifications = (userNotifications, jobDomainActions) =>
  userNotifications.map(({ isNew, ...userNotification }) => ({
    ...userNotification,
    eventFilter: formatEventFilter(userNotification.eventFilter, jobDomainActions),
  }));
