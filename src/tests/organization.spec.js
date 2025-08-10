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

import {
  changeFilterValue,
  changeFilterActions,
  changeFilterStates,
  addAdminRef,
  removeAdminRef,
} from 'reducers/OrganizationReducerUtils';
import { removeRedundantActions } from 'actions/OrganizationUtils';
import { assert } from 'chai';

describe('Organization reducer utils', () => {
  it('should change event filter by key', () => {
    const notification1 = {
      eventFilter: {
        type: null,
        jobDomain: null,
        action: null,
      },
    };

    const notification2 = {
      eventFilter: {
        type: null,
        jobDomain: null,
        action: null,
      },
    };

    const notifications = [];
    notifications.push(notification1, notification2);

    const modifiedNotifications = changeFilterValue(notifications, 'type', 1, 'JOB');

    assert.equal(modifiedNotifications[1].eventFilter.type, 'JOB');
    assert.equal(modifiedNotifications[0].eventFilter.type, null);
    assert.equal(notifications[1].eventFilter.type, null);
    assert.equal(notification1.eventFilter.type, null);
    assert.equal(notification2.eventFilter.type, null);
  });

  it('should add and remove action to event filter actions', () => {
    const notifications = [
      {
        notificationType: 'EMAIL',
        eventFilter: {
          type: 'JOB',
          jobDomain: 'TIMETABLE',
          actions: [],
          states: ['FAILED'],
        },
        enabled: true,
      },
    ];

    const importAdded = changeFilterActions(notifications, 0, 'IMPORT', true);
    assert.deepEqual(importAdded[0].eventFilter.actions, ['IMPORT']);

    const importRemovedAgain = changeFilterActions(importAdded, 0, 'IMPORT', false);
    assert.deepEqual(importRemovedAgain[0].eventFilter.actions, []);
  });

  it('should enable item on disable if * is selected for event filter actions', () => {
    const notifications = [
      {
        notificationType: 'EMAIL',
        eventFilter: {
          type: 'JOB',
          jobDomain: 'TIMETABLE',
          actions: ['*'],
          states: [],
        },
        enabled: true,
      },
    ];

    const importRemoved = changeFilterActions(notifications, 0, 'IMPORT', false);
    assert.deepEqual(importRemoved[0].eventFilter.actions, ['IMPORT']);
  });

  it('should add and remove action to event filter states', () => {
    const notifications = [
      {
        notificationType: 'EMAIL',
        eventFilter: {
          type: 'JOB',
          jobDomain: 'TIMETABLE',
          actions: [],
          states: [],
        },
        enabled: true,
      },
    ];

    const failedAdded = changeFilterStates(notifications, 0, 'FAILED', true);
    assert.deepEqual(failedAdded[0].eventFilter.states, ['FAILED']);

    const failedRemovedAgain = changeFilterStates(failedAdded, 0, 'FAILED', false);
    assert.deepEqual(failedRemovedAgain[0].eventFilter.states, []);
  });

  it('should add adminZoneRef', () => {
    const notifications = [
      {
        notificationType: 'EMAIL',
        eventFilter: {
          administrativeZoneRefs: [],
        },
        enabled: true,
      },
    ];

    const adminZoneRef = 'RB:AdministrativeZone:0127';
    const newNotifications = addAdminRef(notifications, 0, adminZoneRef);
    assert.deepEqual(newNotifications[0].eventFilter.administrativeZoneRefs, [adminZoneRef]);
  });

  it('should remove adminZoneRef', () => {
    const notifications = [
      {
        notificationType: 'EMAIL',
        eventFilter: {
          administrativeZoneRefs: ['RB:AdministrativeZone:0127', 'RB:AdministrativeZone:0128'],
        },
        enabled: true,
      },
    ];

    const adminZoneRefRemove = 'RB:AdministrativeZone:0127';
    const newNotifications = removeAdminRef(notifications, 0, adminZoneRefRemove);
    assert.deepEqual(newNotifications[0].eventFilter.administrativeZoneRefs, [
      'RB:AdministrativeZone:0128',
    ]);
  });

  it('should remove redundant job domain actions', () => {
    const jobDomainActions = {
      TIMETABLE: [
        '*',
        'FILE_TRANSFER',
        'FILE_CLASSIFICATION',
        'IMPORT',
        'EXPORT',
        'VALIDATION_LEVEL_1',
        'VALIDATION_LEVEL_2',
        'CLEAN',
        'DATASPACE_TRANSFER',
        'BUILD_GRAPH',
        'EXPORT_NETEX',
      ],
      GEOCODER: [
        '*',
        'ADDRESS_DOWNLOAD',
        'ADMINISTRATIVE_UNITS_DOWNLOAD',
        'PLACE_NAMES_DOWNLOAD',
        'TIAMAT_POI_UPDATE',
        'TIAMAT_ADMINISTRATIVE_UNITS_UPDATE',
        'TIAMAT_NEIGHBOURING_COUNTRIES_UPDATE',
        'TIAMAT_EXPORT',
        'PELIAS_UPDATE',
      ],
      GRAPH: ['*', 'BUILD_GRAPH'],
    };

    const allActionsForJobDomain = [
      'FILE_TRANSFER',
      'FILE_CLASSIFICATION',
      'IMPORT',
      'EXPORT',
      'VALIDATION_LEVEL_1',
      'VALIDATION_LEVEL_2',
      'CLEAN',
      'DATASPACE_TRANSFER',
      'BUILD_GRAPH',
      'EXPORT_NETEX',
    ];

    const checkedAllActions = removeRedundantActions(
      allActionsForJobDomain,
      'TIMETABLE',
      jobDomainActions
    );
    assert.deepEqual(checkedAllActions, ['*']);

    const someActionsForJobDomain = ['FILE_TRANSFER', 'FILE_CLASSIFICATION', 'IMPORT'];

    const checkedSomeActions = removeRedundantActions(
      someActionsForJobDomain,
      'TIMETABLE',
      jobDomainActions
    );
    assert.deepEqual(checkedSomeActions, ['FILE_TRANSFER', 'FILE_CLASSIFICATION', 'IMPORT']);

    const allActionsForJobDomainWithAsterisk = [
      '*',
      'FILE_TRANSFER',
      'FILE_CLASSIFICATION',
      'IMPORT',
      'EXPORT',
      'VALIDATION_LEVEL_1',
      'VALIDATION_LEVEL_2',
      'CLEAN',
      'DATASPACE_TRANSFER',
      'BUILD_GRAPH',
      'EXPORT_NETEX',
    ];

    const allActionsWithAsterisk = removeRedundantActions(
      allActionsForJobDomainWithAsterisk,
      'TIMETABLE',
      jobDomainActions
    );
    assert.deepEqual(allActionsWithAsterisk, ['*']);
  });
});
