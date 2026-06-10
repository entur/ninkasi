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
import { Edit, Delete, Add } from '@mui/icons-material';
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
import ResponsbilityRoleAssignments from 'modals/ResponsbilityRoleAssignments';
import ModalCreateResponsibilitySet from 'modals/ModalCreateResponsibilitySet';
import ModalEditResponsibilitySet from 'modals/ModalEditResponsibilitySet';
import ModalConfirmation from 'modals/ModalConfirmation';
import { sortByColumns } from 'utils/index';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import {
  fetchResponsibilitySets,
  fetchCodeSpaces,
  fetchRoles,
  fetchOrganizations,
  fetchEntityTypes,
  fetchAdministrativeZones,
} from 'reducers/OrganizationReducer';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';

interface SortOrder {
  column: string;
  asc: boolean;
}

const ResponsibilitiesView = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const responsibilities = useAppSelector(
    (state: any) => state.OrganizationReducer.responsibilities
  );
  const codeSpaces = useAppSelector((state: any) => state.OrganizationReducer.codeSpaces);
  const roles = useAppSelector((state: any) => state.OrganizationReducer.roles);
  const organizations = useAppSelector((state: any) => state.OrganizationReducer.organizations);
  const status = useAppSelector((state: any) => state.OrganizationReducer.responsibilitySetStatus);
  const entityTypes = useAppSelector((state: any) => state.OrganizationReducer.entityTypes);
  const administrativeZones = useAppSelector(
    (state: any) => state.OrganizationReducer.administrativeZones
  );

  const [isCreatingResponsibilitySet, setIsCreatingResponsibilitySet] = useState(false);
  const [isEditingResponsibilitySet, setIsEditingResponsibilitySet] = useState(false);
  const [activeResponsibilitySet, setActiveResponsibilitySet] = useState<any>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>({ column: 'name', asc: true });

  useEffect(() => {
    dispatch(fetchResponsibilitySets(getToken));
    dispatch(fetchCodeSpaces(getToken));
    dispatch(fetchRoles(getToken));
    dispatch(fetchOrganizations(getToken));
    dispatch(fetchEntityTypes(getToken));

    if (!administrativeZones.length) {
      dispatch(fetchAdministrativeZones(getToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getToken]);

  // Close create/edit modals on successful operation (status.error === null).
  useEffect(() => {
    if (status && status.error === null) {
      setIsCreatingResponsibilitySet(false);
      setIsEditingResponsibilitySet(false);
    }
  }, [status]);

  const openModalWindow = () => {
    setIsCreatingResponsibilitySet(true);
  };

  const handleOpenEditResp = (responsibility: any) => {
    setIsEditingResponsibilitySet(true);
    setActiveResponsibilitySet(responsibility);
  };

  const handleOpenDeleteConfirmationDialog = (responsibility: any) => {
    setActiveResponsibilitySet(responsibility);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setActiveResponsibilitySet(null);
    setIsDeleteConfirmationOpen(false);
  };

  const getDeleteConfirmationTitle = () => {
    const responsbilitySet = activeResponsibilitySet ? activeResponsibilitySet.name : 'N/A';
    return `Delete responsiblity set ${responsbilitySet}`;
  };

  const handleSortOrder = (column: string) => {
    const asc = sortOrder.column === column ? !sortOrder.asc : true;
    setSortOrder({ column, asc });
  };

  const sortDirection = (column: string): 'asc' | 'desc' | false =>
    sortOrder.column === column ? (sortOrder.asc ? 'asc' : 'desc') : false;

  const handleCreateResponsibilitySet = (responsibilitySet: any) => {
    dispatch(OrganizationRegisterActions.createResponsibilitySet(responsibilitySet, getToken));
  };

  const handleUpdateResponsibilitySet = (responsibilitySet: any) => {
    dispatch(OrganizationRegisterActions.updateResponsibilitySet(responsibilitySet, getToken));
  };

  const handleDeleteResponsibility = (responsibility: any) => {
    handleCloseDeleteConfirmation();
    dispatch(OrganizationRegisterActions.deleteResponsibilitySet(responsibility.id, getToken));
  };

  const sortedResponsibilities = sortByColumns(responsibilities, sortOrder);
  const confirmDeleteTitle = getDeleteConfirmationTitle();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Fab
          size="small"
          aria-label="Create responsibility set"
          sx={{ mr: '10px' }}
          onClick={openModalWindow}
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
              <TableCell sortDirection={sortDirection('id')}>
                <TableSortLabel
                  active={sortOrder.column === 'id'}
                  direction={sortOrder.asc ? 'asc' : 'desc'}
                  onClick={() => handleSortOrder('id')}
                >
                  Id
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
              <TableCell>Roles assignments</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedResponsibilities.map((responsibility: any) => (
              <TableRow key={'responsibility-' + responsibility.id} hover>
                <TableCell>{responsibility.name}</TableCell>
                <TableCell>{responsibility.id}</TableCell>
                <TableCell>{responsibility.privateCode}</TableCell>
                <TableCell>
                  <ResponsbilityRoleAssignments
                    roleAssignments={responsibility.roles}
                    organizations={organizations}
                    adminZones={administrativeZones}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Delete responsibility set"
                    onClick={() => handleOpenDeleteConfirmationDialog(responsibility)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="Edit responsibility set"
                    onClick={() => handleOpenEditResp(responsibility)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isCreatingResponsibilitySet ? (
        <ModalCreateResponsibilitySet
          modalOpen={isCreatingResponsibilitySet}
          codeSpaces={codeSpaces}
          handleOnClose={() => setIsCreatingResponsibilitySet(false)}
          takenPrivateCodes={responsibilities.map((r: any) => r.privateCode)}
          roles={roles}
          organizations={organizations}
          handleSubmit={handleCreateResponsibilitySet}
          entityTypes={entityTypes}
          administrativeZones={administrativeZones}
        />
      ) : null}
      {isEditingResponsibilitySet ? (
        <ModalEditResponsibilitySet
          modalOpen={isEditingResponsibilitySet}
          responsibilitySet={activeResponsibilitySet}
          codeSpaces={codeSpaces}
          handleOnClose={() => setIsEditingResponsibilitySet(false)}
          takenPrivateCodes={responsibilities.map((r: any) => r.privateCode)}
          roles={roles}
          organizations={organizations}
          handleSubmit={handleUpdateResponsibilitySet}
          entityTypes={entityTypes}
          administrativeZones={administrativeZones}
        />
      ) : null}
      <ModalConfirmation
        open={isDeleteConfirmationOpen}
        title={confirmDeleteTitle}
        actionBtnTitle="Delete"
        body="You are about to delete current responsibility set. Are you sure?"
        handleSubmit={() => handleDeleteResponsibility(activeResponsibilitySet)}
        handleClose={handleCloseDeleteConfirmation}
      />
    </Box>
  );
};

export default ResponsibilitiesView;
