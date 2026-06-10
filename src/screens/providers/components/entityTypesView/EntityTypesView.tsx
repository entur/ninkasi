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
import { Edit, Add, Delete } from '@mui/icons-material';
import {
  Box,
  Fab,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
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
    const asc = sortOrder.column === column ? !sortOrder.asc : true;
    setSortOrder({ column, asc });
  };

  const sortDirection = (column: string): 'asc' | 'desc' | false =>
    sortOrder.column === column ? (sortOrder.asc ? 'asc' : 'desc') : false;

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

  const sortedEntityTypes = sortByColumns(entityTypes, sortOrder);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Fab
          size="small"
          aria-label="Create entity type"
          sx={{ mr: '10px' }}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Add />
        </Fab>
      </Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortDirection('name')}>
                <TableSortLabel
                  active={sortOrder.column === 'name'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortDirection('privateCode')}>
                <TableSortLabel
                  active={sortOrder.column === 'privateCode'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('privateCode')}
                >
                  Private code
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortDirection('codeSpace')}>
                <TableSortLabel
                  active={sortOrder.column === 'codeSpace'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('codeSpace')}
                >
                  Codespace
                </TableSortLabel>
              </TableCell>
              <TableCell>Classifications</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEntityTypes.map((et: any) => (
              <TableRow key={'et-' + et.id} hover>
                <TableCell>{et.name}</TableCell>
                <TableCell>{et.privateCode}</TableCell>
                <TableCell>{et.codeSpace}</TableCell>
                <TableCell>
                  {et.classifications && et.classifications.length ? (
                    <Box component="ul" sx={{ m: 0, pl: 2.5, listStyleType: 'disc' }}>
                      {[...et.classifications]
                        .sort((a: any, b: any) => a.name.localeCompare(b.name))
                        .map((ec: any) => (
                          <li key={ec.id}>{ec.name}</li>
                        ))}
                    </Box>
                  ) : null}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Delete entity type"
                    onClick={() => handleOpenDeleteConfirmationDialog(et)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="Edit entity type"
                    onClick={() => handleEditEntityType(et)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
        title={`Delete entity type ${activeEntityType ? activeEntityType.name : 'N/A'}`}
        actionBtnTitle="Delete"
        body="You are about to delete current entity type. Are you sure?"
        handleSubmit={() => handleDeleteEntityType(activeEntityType)}
        handleClose={handleCloseDeleteConfirmation}
      />
    </Box>
  );
};

export default EntityTypesView;
