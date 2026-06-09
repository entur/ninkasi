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
import NotificationAddEntityClassRef from './NotificationAddEntityClassRef';
import { IconButton } from '@mui/material';
import { Remove } from '@mui/icons-material';
import { useAppDispatch } from 'store/hooks';
import { removedEntityClassRef } from 'reducers/OrganizationReducer';

interface NotificationLike {
  eventFilter: {
    entityClassificationRefs?: string[];
  };
}

interface NotificationEntityClassRefsProps {
  notification: NotificationLike;
  visible: boolean;
  index: number;
}

const NotificationEntityClassRefs = ({
  notification,
  visible,
  index,
}: NotificationEntityClassRefsProps) => {
  const dispatch = useAppDispatch();
  const entityRefsRef = useRef<HTMLSelectElement | null>(null);

  const entityClassRefs = notification.eventFilter.entityClassificationRefs || [];

  const handleRemoveEntityClass = () => {
    const entityRefs = entityRefsRef.current;
    if (!entityRefs) return;
    const selectedIndex = entityRefs.options.selectedIndex;
    const entityClassToRemove = entityClassRefs[selectedIndex];

    if (entityClassToRemove) {
      dispatch(removedEntityClassRef({ index, entityClassRef: entityClassToRemove }));
    }
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
      <div style={{ width: '100%', fontSize: 12, fontWeight: 600 }}>
        Entity classification
        <span style={{ color: 'red', fontSize: 10 }}>*</span>
      </div>
      <div style={{ display: 'flex' }}>
        <select multiple ref={entityRefsRef} style={{ width: '100%', fontSize: 12, flex: 2 }}>
          {entityClassRefs.map((ref: string, idx: number) => (
            <option key={'entity-' + idx}>{ref} </option>
          ))}
        </select>
        <IconButton onClick={handleRemoveEntityClass} size="large">
          <Remove style={{ color: '#cc0000' }} />
        </IconButton>
      </div>
      {entityClassRefs.length === 0 && (
        <span
          style={{
            fontSize: 12,
            color: 'red',
            textAlign: 'left',
          }}
        >
          Required set of entity classifications can not be empty
        </span>
      )}
      <NotificationAddEntityClassRef index={index} />
    </div>
  );
};

export default NotificationEntityClassRefs;
