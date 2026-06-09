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

import { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';
import { addedEntityClassRef } from 'reducers/OrganizationReducer';

interface NotificationAddEntityClassRefProps {
  index: number;
}

const NotificationAddEntityClassRef = ({ index }: NotificationAddEntityClassRefProps) => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();
  const entityTypes = useAppSelector((state: any) => state.OrganizationReducer.entityTypes);

  const [entityClassificationRefs, setEntityClassificationRefs] = useState<any[]>([]);
  const [entityType, setEntityType] = useState<string>(entityTypes[0]?.id ?? '');
  const [entityClasRefSelected, setEntityClasRefSelected] = useState<string | null>(null);

  const getEntityClassificationsForType = (type: string) => {
    OrganizationRegisterActions.getEntityByClassification(type, getToken).then((response: any) => {
      setEntityClassificationRefs(response.data);
      setEntityType(type);
    });
  };

  useEffect(() => {
    if (entityType) {
      getEntityClassificationsForType(entityType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    if (entityClasRefSelected !== null) {
      dispatch(addedEntityClassRef({ index, entityClassRef: entityClasRefSelected }));
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <FormControl fullWidth margin="normal">
        <InputLabel id="entity-type-label">Entity type</InputLabel>
        <Select
          labelId="entity-type-label"
          label="Entity type"
          value={entityType}
          onChange={e => getEntityClassificationsForType(e.target.value as string)}
        >
          {entityTypes.map((entity: any) => (
            <MenuItem key={entity.id} value={entity.id}>
              {entity.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth style={{ marginLeft: 16 }} margin="normal">
        <InputLabel id="entity-classification-label">Entity classification</InputLabel>
        <Select
          labelId="entity-classification-label"
          label="Entity classification"
          value={entityClasRefSelected ?? ''}
          onChange={e => {
            setEntityClasRefSelected(e.target.value as string);
          }}
        >
          {entityClassificationRefs.map((type: any) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="text" onClick={handleAdd} disabled={!entityClasRefSelected}>
        Add
      </Button>
    </div>
  );
};

export default NotificationAddEntityClassRef;
