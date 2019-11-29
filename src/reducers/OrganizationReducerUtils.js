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

export const changeJobDomainValue = (original, index, newValue) => {
  return original.map((notification, i) => {
    if (index === i) {
      let newEventFilter = Object.assign({}, notification.eventFilter, {
        jobDomain: newValue,
        actions: []
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
    let allWasChosen = actions.indexOf("*") > -1;

    actions = actions.filter(entry => !(action === entry || entry === "*"));

    if (allWasChosen && action !== "*") {
      actions.push(action);
    }
  }

  return changeFilterValue(original, "actions", index, actions);
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

  return changeFilterValue(original, "states", index, states);
};

export const addAdminRef = (original, index, id) => {
  let adminRefs = original[index].eventFilter.administrativeZoneRefs
    ? original[index].eventFilter.administrativeZoneRefs.slice()
    : [];
  if (adminRefs.indexOf(id) === -1) {
    adminRefs.push(id);
  }
  return changeFilterValue(
    original,
    "administrativeZoneRefs",
    index,
    adminRefs
  );
};

export const addEntityClassRef = (original, index, id) => {
  let entityClassRefs = original[index].eventFilter.entityClassificationRefs
    ? original[index].eventFilter.entityClassificationRefs.slice()
    : [];
  if (entityClassRefs.indexOf(id) === -1) {
    entityClassRefs.push(id);
  }
  return changeFilterValue(
    original,
    "entityClassificationRefs",
    index,
    entityClassRefs
  );
};

export const removeEntityClassRef = (original, index, id) => {
  let entityClassRefs = original[index].eventFilter.entityClassificationRefs
    ? original[index].eventFilter.entityClassificationRefs.slice()
    : [];

  entityClassRefs = entityClassRefs.filter(ref => ref !== id);

  return changeFilterValue(
    original,
    "entityClassificationRefs",
    index,
    entityClassRefs
  );
};

export const removeAdminRef = (original, index, id) => {
  let adminRefs = original[index].eventFilter.administrativeZoneRefs
    ? original[index].eventFilter.administrativeZoneRefs.slice()
    : [];

  adminRefs = adminRefs.filter(ref => ref !== id);

  return changeFilterValue(
    original,
    "administrativeZoneRefs",
    index,
    adminRefs
  );
};
