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

import { useRef } from 'react';
import NotificationAddZoneRef from './NotificationAddZoneRef';
import { IconButton } from '@mui/material';
import { Remove } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { addedAdminZoneRef, removedAdminZoneRef } from 'reducers/OrganizationReducer';

interface NotificationLike {
  eventFilter: {
    administrativeZoneRefs?: string[];
  };
}

interface NotificationAdminZoneRefsProps {
  notification: NotificationLike;
  visible: boolean;
  index: number;
}

const NotificationAdminZoneRefs = ({
  notification,
  visible,
  index,
}: NotificationAdminZoneRefsProps) => {
  const dispatch = useAppDispatch();
  const administrativeZones = useAppSelector(
    (state: any) => state.OrganizationReducer.administrativeZones
  );
  const adminRefsRef = useRef<HTMLSelectElement | null>(null);

  const administrativeZoneRefs = notification.eventFilter.administrativeZoneRefs || [];

  const handleRemoveAdminRefRole = () => {
    const adminRefs = adminRefsRef.current;
    if (!adminRefs) return;
    const selectedIndex = adminRefs.options.selectedIndex;
    const adminZoneIdToDelete = administrativeZoneRefs[selectedIndex];

    if (adminZoneIdToDelete) {
      dispatch(removedAdminZoneRef({ index, id: adminZoneIdToDelete }));
    }
  };

  const handleAddAdminRefRole = (value: string) => {
    dispatch(addedAdminZoneRef({ index, id: value }));
  };

  return (
    <div
      style={{
        display: visible ? 'none' : 'flex',
        flexDirection: 'column',
        flex: 2,
        border: '1px solid #eee',
        padding: 5,
      }}
    >
      <div style={{ width: '100%', fontSize: 12, fontWeight: 600 }}>Administrative zones</div>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 2 }}>
          <select multiple ref={adminRefsRef} style={{ width: '100%', fontSize: 12 }}>
            {administrativeZoneRefs.map((ref: string, idx: number) => (
              <option key={'entity-' + idx}>
                {ref} - {administrativeZones.find((az: any) => az.id === ref)?.name}{' '}
              </option>
            ))}
          </select>
          <NotificationAddZoneRef
            handleAdd={handleAddAdminRefRole}
            dataSource={administrativeZones}
            handleDelete={handleRemoveAdminRefRole}
          />
        </div>
        <IconButton onClick={handleRemoveAdminRefRole} size="large">
          <Remove style={{ color: '#cc0000' }} />
        </IconButton>
      </div>
    </div>
  );
};

export default NotificationAdminZoneRefs;
