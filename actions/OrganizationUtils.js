export const removeRedundantActions = (actions, jobDomain, jobDomainActions) => {
  if (!actions || !actions.length) return [];

  let asteriskFound = actions.indexOf('*') > -1;

  if (asteriskFound) {
    return ['*'];
  }

  // -1 because * is included in allActions
  if (actions.length >= jobDomainActions[jobDomain].length - 1) {
    return ['*'];
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

    if (userNotification.eventFilter.type === 'JOB') {
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
    } else if (userNotification.eventFilter.type === 'CRUD') {
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
