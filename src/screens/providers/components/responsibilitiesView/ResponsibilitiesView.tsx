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
import { Box, Fab } from '@mui/material';
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

const columnBaseSx = {
  display: 'inline-block',
  m: '2px',
  mb: '5px',
  fontSize: '0.9em',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

const col16Sx = {
  ...columnBaseSx,
  width: '14%',
  maxWidth: '14%',
  minWidth: '14%',
};

const col17Sx = {
  ...columnBaseSx,
  width: '10%',
  maxWidth: '10%',
  minWidth: '10%',
};

const col13Sx = {
  ...columnBaseSx,
  width: '53%',
  maxWidth: '53%',
  minWidth: '53%',
};

const sortableSx = {
  borderBottom: '1px dotted',
  cursor: 'pointer',
};

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
    let asc = true;
    if (sortOrder.column === column) {
      asc = !sortOrder.asc;
    }
    setSortOrder({ column, asc });
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Fab size="small" sx={{ marginRight: '10px' }} onClick={openModalWindow}>
          <Add />
        </Fab>
      </Box>
      <Box>
        <Box
          sx={{
            fontWeight: 600,
            textTransform: 'uppercase',
            bgcolor: 'rgba(238, 238, 238, 0.28)',
            mb: '5px',
          }}
        >
          <Box sx={col16Sx}>
            <Box component="span" onClick={() => handleSortOrder('name')} sx={sortableSx}>
              name
            </Box>
          </Box>
          <Box sx={col16Sx}>
            <Box component="span" onClick={() => handleSortOrder('id')} sx={sortableSx}>
              id
            </Box>
          </Box>
          <Box sx={col17Sx}>
            <Box component="span" onClick={() => handleSortOrder('privateCode')} sx={sortableSx}>
              private code
            </Box>
          </Box>
          <Box sx={col16Sx}>Roles assignments</Box>
        </Box>
        {sortedResponsibilities.map((responsibility: any) => {
          return (
            <Box
              key={'responsibility-' + responsibility.id}
              sx={{
                display: 'flex',
                '&:nth-of-type(even)': { bgcolor: 'hsla(0, 0%, 50%, 0.07)' },
              }}
            >
              <Box sx={col16Sx}>{responsibility.name}</Box>
              <Box sx={col16Sx}>{responsibility.id}</Box>
              <Box sx={col17Sx}>{responsibility.privateCode}</Box>
              <Box sx={col13Sx}>
                <ResponsbilityRoleAssignments
                  roleAssignments={responsibility.roles}
                  organizations={organizations}
                  adminZones={administrativeZones}
                />
              </Box>
              <Box
                sx={{
                  float: 'right',
                  mr: '10px',
                  width: 'auto',
                  display: 'inline-block',
                  cursor: 'pointer',
                }}
              >
                <Delete
                  sx={{
                    height: 20,
                    width: 20,
                    marginRight: '10px',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: '#fa7b81',
                  }}
                  onClick={() => handleOpenDeleteConfirmationDialog(responsibility)}
                />
                <Edit
                  sx={{
                    height: 20,
                    width: 20,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: 'rgba(25, 118, 210, 0.59)',
                  }}
                  onClick={() => {
                    handleOpenEditResp(responsibility);
                  }}
                />
              </Box>
            </Box>
          );
        })}
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
          handleSubmit={() => {
            handleDeleteResponsibility(activeResponsibilitySet);
          }}
          handleClose={() => {
            handleCloseDeleteConfirmation();
          }}
        />
      </Box>
    </Box>
  );
};

export default ResponsibilitiesView;
