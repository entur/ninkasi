export const changeFilterValue = (original, key, index, newValue) => {
  return original.map((notification, i) => {
    if (index === i) {
      let newEventFilter = Object.assign({}, notification.eventFilter, {
        [key]: newValue
      });

      return {
        ...notification,
        eventFilter: newEventFilter
      };
    } else {
      return notification;
    }
  });
};

export const changeFilterActions = (original, index, action, isChecked) => {
  let actions = original[index].eventFilter.actions
    ? original[index].eventFilter.actions.slice()
    : [];

  if (isChecked) {
    actions.push(action);
  } else {
    let allWasChosen = actions.indexOf('*') > -1;

    actions = actions.filter(entry => !(action === entry || entry === '*'));

    if (allWasChosen && action !== '*') {
      actions.push(action);
    }
  }

  return changeFilterValue(original, 'actions', index, actions);
};

export const changeFilterStates = (original, index, state, isChecked) => {
  let states = original[index].eventFilter.states
    ? original[index].eventFilter.states.slice()
    : [];

  if (isChecked) {
    states.push(state);
  } else {
    states = states.filter(entry => state !== entry);
  }

  return changeFilterValue(original, 'states', index, states);
};

export const addAdminRef = (original, index, id) => {
  let adminRefs = original[index].eventFilter.administrativeZoneRefs
    ? original[index].eventFilter.administrativeZoneRefs.slice()
    : [];
  if (adminRefs.indexOf(id) === -1) {
    adminRefs.push(id);
  }
  return changeFilterValue(original, 'administrativeZoneRefs', index, adminRefs);
};

export const removeAdminRef = (original, index, id) => {
  let adminRefs = original[index].eventFilter.administrativeZoneRefs
    ? original[index].eventFilter.administrativeZoneRefs.slice()
    : [];

  adminRefs = adminRefs.filter(ref => ref !== id);

  return changeFilterValue(original, 'administrativeZoneRefs', index, adminRefs);
};