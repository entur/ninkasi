import { changeFilterValue, changeFilterActions, changeFilterStates, addAdminRef, removeAdminRef } from '../reducers/OrganizationReducerUtils';
import { assert } from 'chai'

describe('Organization reducer utils', ()  => {

  it('should change event filter by key', () => {

      let notification1 = {
          eventFilter: {
            type: null,
            jobDomain: null,
            action: null,
          }
      };

    let notification2 = {
      eventFilter: {
        type: null,
        jobDomain: null,
        action: null,
      }
    };

    let notifications = [];
    notifications.push(notification1, notification2);

    let modifiedNotifications = changeFilterValue(notifications, 'type', 1, 'JOB');

    assert.equal(modifiedNotifications[1].eventFilter.type, 'JOB');
    assert.equal(modifiedNotifications[0].eventFilter.type, null);
    assert.equal(notifications[1].eventFilter.type, null);
    assert.equal(notification1.eventFilter.type, null);
    assert.equal(notification2.eventFilter.type, null);
  })

  it('should add and remove action to event filter actions', () => {

    let notifications = [{
      notificationType: "EMAIL",
      eventFilter: {
        type: "JOB",
        jobDomain: "TIMETABLE",
        actions: [],
        states: [
          "FAILED"
        ]
      },
      enabled: true
    }];

    let importAdded = changeFilterActions(notifications, 0, 'IMPORT', true);
    assert.deepEqual(importAdded[0].eventFilter.actions, ['IMPORT']);

    let importRemovedAgain = changeFilterActions(importAdded, 0, 'IMPORT', false);
    assert.deepEqual(importRemovedAgain[0].eventFilter.actions, []);
  });

  it('should enable item on disable if * is selected for event filter actions', () => {

    let notifications = [{
      notificationType: "EMAIL",
      eventFilter: {
        type: "JOB",
        jobDomain: "TIMETABLE",
        actions: ['*'],
        states: []
      },
      enabled: true
    }];

    let importRemoved = changeFilterActions(notifications, 0, 'IMPORT', false);
    assert.deepEqual(importRemoved[0].eventFilter.actions, ['IMPORT']);
  });

  it('should add and remove action to event filter states', () => {

    let notifications = [{
      notificationType: "EMAIL",
      eventFilter: {
        type: "JOB",
        jobDomain: "TIMETABLE",
        actions: [],
        states: []
      },
      enabled: true
    }];

    let failedAdded = changeFilterStates(notifications, 0, 'FAILED', true);
    assert.deepEqual(failedAdded[0].eventFilter.states, ['FAILED']);

    let failedRemovedAgain = changeFilterStates(failedAdded, 0, 'FAILED', false);
    assert.deepEqual(failedRemovedAgain[0].eventFilter.states, []);
  });

  it('should add adminZoneRef', () => {

    let notifications = [{
      notificationType: "EMAIL",
      eventFilter: {
        administrativeZoneRefs: []
      },
      enabled: true
    }];

    let adminZoneRef = 'RB:AdministrativeZone:0127';
    let newNotifications = addAdminRef(notifications, 0, adminZoneRef);
    assert.deepEqual(newNotifications[0].eventFilter.administrativeZoneRefs, [adminZoneRef]);
  })

  it('should remove adminZoneRef', () => {

    let notifications = [{
      notificationType: "EMAIL",
      eventFilter: {
        administrativeZoneRefs: ['RB:AdministrativeZone:0127', 'RB:AdministrativeZone:0128']
      },
      enabled: true
    }];

    let adminZoneRefRemove = 'RB:AdministrativeZone:0127';
    let newNotifications = removeAdminRef(notifications, 0, adminZoneRefRemove);
    assert.deepEqual(newNotifications[0].eventFilter.administrativeZoneRefs, ['RB:AdministrativeZone:0128']);
  })

})


