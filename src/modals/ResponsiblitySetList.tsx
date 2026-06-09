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
import { Remove, Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface Responsibility {
  id: string;
  name: string;
}

interface UserLike {
  responsibilitySetRefs: string[];
}

interface ResponsiblitySetListProps {
  user: UserLike;
  responsiblities: Responsibility[];
  handleAdd: (e: React.MouseEvent<HTMLElement>) => void;
  handleRemove: (index: number) => void;
}

const ResponsiblitySetList = ({
  user,
  responsiblities,
  handleAdd,
  handleRemove,
}: ResponsiblitySetListProps) => {
  const responsibilitySetRef = useRef<HTMLSelectElement | null>(null);

  const getResponbilityNameById = (id: string) => {
    for (let i = 0; responsiblities.length; i++) {
      if (responsiblities[i].id === id) {
        return responsiblities[i].name;
      }
    }
    return 'N/A';
  };

  const handleRemoveResponsibilitySet = () => {
    const responsibilitySets = responsibilitySetRef.current;
    if (!responsibilitySets) return;
    const index = responsibilitySets.options.selectedIndex;
    handleRemove(index);
  };

  return (
    <div>
      <div style={{ fontSize: '0.8em', marginBottom: 2 }}>Responsibility sets</div>
      <select multiple style={{ width: '100%', fontSize: 12 }} ref={responsibilitySetRef}>
        {user.responsibilitySetRefs.map((rs, index) => (
          <option key={'ec-' + index}>{getResponbilityNameById(rs)} </option>
        ))}
      </select>
      <div style={{ textAlign: 'left', width: '100%' }}>
        <IconButton
          onClick={e => {
            handleAdd(e);
          }}
          size="large"
        >
          <Add style={{ color: '#228B22' }} />
        </IconButton>
        <IconButton onClick={handleRemoveResponsibilitySet} size="large">
          <Remove style={{ color: '#cc0000' }} />
        </IconButton>
      </div>
    </div>
  );
};

export default ResponsiblitySetList;
