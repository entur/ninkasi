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
import './entityTypesView.scss';
import { Edit, Add, Delete } from '@mui/icons-material';
import { Fab } from '@mui/material';
import ModalCreateEntityType from 'modals/ModalCreateEntityType';
import ModalEditEntiyType from 'modals/ModalEditEntityType';
import ModalConfirmation from 'modals/ModalConfirmation';
import { sortByColumns } from 'utils/index';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import { fetchEntityTypes, fetchCodeSpaces } from 'reducers/OrganizationReducer';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';

interface SortOrder {
  column: string;
  asc: boolean;
}

const EntityTypesView = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const entityTypes = useAppSelector((state: any) => state.OrganizationReducer.entityTypes);
  const codeSpaces = useAppSelector((state: any) => state.OrganizationReducer.codeSpaces);
  const status = useAppSelector((state: any) => state.OrganizationReducer.entityTypeStatus);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [activeEntityType, setActiveEntityType] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>({ column: 'name', asc: true });

  useEffect(() => {
    dispatch(fetchEntityTypes(getToken));
    dispatch(fetchCodeSpaces(getToken));
  }, [dispatch, getToken]);

  // Close create/edit modals on successful operation (status.error === null).
  useEffect(() => {
    if (status && status.error === null && (isCreateModalOpen || isEditModalOpen)) {
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
    }
    // Only react to status changes — modal-open flags are read for guard only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleOpenDeleteConfirmationDialog = (entityType: any) => {
    setActiveEntityType(entityType);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setActiveEntityType(null);
    setIsDeleteConfirmationOpen(false);
  };

  const handleEditEntityType = (entityType: any) => {
    setActiveEntityType(entityType);
    setIsEditModalOpen(true);
  };

  const handleSortOrder = (column: string) => {
    let asc = true;
    if (sortOrder.column === column) {
      asc = !sortOrder.asc;
    }
    setSortOrder({ column, asc });
  };

  const handleCreateEntity = (entityType: any) => {
    dispatch(OrganizationRegisterActions.createEntityType(entityType, getToken));
  };

  const handleUpdateEntity = (entityType: any) => {
    dispatch(OrganizationRegisterActions.updateEntityType(entityType, getToken));
  };

  const handleDeleteEntityType = (entityType: any) => {
    handleCloseDeleteConfirmation();
    dispatch(OrganizationRegisterActions.deleteEntityType(entityType.id, getToken));
  };

  const getDeleteConfirmationTitle = () => {
    const entityType = activeEntityType ? activeEntityType.name : 'N/A';
    return `Delete entity type ${entityType}`;
  };

  const sortedEntityTypes = sortByColumns(entityTypes, sortOrder);
  const confirmDeleteTitle = getDeleteConfirmationTitle();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Fab
          size="small"
          style={{ float: 'right', marginRight: 10 }}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Add />
        </Fab>
      </div>
      <div className="et-row">
        <div className="et-header">
          <div className="col-1-5">
            <span className="sortable" onClick={() => handleSortOrder('name')}>
              name
            </span>
          </div>
          <div className="col-1-5">
            <span className="sortable" onClick={() => handleSortOrder('privateCode')}>
              private code
            </span>
          </div>
          <div className="col-1-5">
            <span className="sortable" onClick={() => handleSortOrder('codeSpace')}>
              codespace
            </span>
          </div>
          <div className="col-1-5">
            <span>Classifications</span>
          </div>
        </div>
        {sortedEntityTypes.map((et: any) => {
          return (
            <div key={'et-' + et.id} className="et-row-item">
              <div className="col-1-5">{et.name}</div>
              <div className="col-1-5">{et.privateCode}</div>
              <div className="col-1-5">{et.codeSpace}</div>
              <div className="col-1-5">
                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    listStyleType: 'circle',
                  }}
                >
                  {et.classifications
                    ? [...et.classifications]
                        .sort((a: any, b: any) => a.name.localeCompare(b.name))
                        .map((ec: any) => <li key={ec.id}>{ec.name} </li>)
                    : null}
                </ul>
              </div>
              <div className="col-icon" style={{ cursor: 'pointer' }}>
                <Delete
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 10,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: '#fa7b81',
                  }}
                  onClick={() => handleOpenDeleteConfirmationDialog(et)}
                />
                <Edit
                  style={{
                    height: 20,
                    width: 20,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: 'rgba(25, 118, 210, 0.59)',
                  }}
                  onClick={() => handleEditEntityType(et)}
                />
              </div>
            </div>
          );
        })}
        {isCreateModalOpen ? (
          <ModalCreateEntityType
            isModalOpen={isCreateModalOpen}
            codeSpaces={codeSpaces}
            handleCloseModal={() => setIsCreateModalOpen(false)}
            takenPrivateCodes={entityTypes.map((et: any) => et.privateCode)}
            handleSubmit={handleCreateEntity}
          />
        ) : null}
        {isEditModalOpen ? (
          <ModalEditEntiyType
            isModalOpen={isEditModalOpen}
            entityType={activeEntityType}
            handleCloseModal={() => setIsEditModalOpen(false)}
            codeSpaces={codeSpaces}
            handleSubmit={handleUpdateEntity}
          />
        ) : null}
        <ModalConfirmation
          open={isDeleteConfirmationOpen}
          title={confirmDeleteTitle}
          actionBtnTitle="Delete"
          body="You are about to delete current entity type. Are you sure?"
          handleSubmit={() => {
            handleDeleteEntityType(activeEntityType);
          }}
          handleClose={() => {
            handleCloseDeleteConfirmation();
          }}
        />
      </div>
    </div>
  );
};

export default EntityTypesView;
