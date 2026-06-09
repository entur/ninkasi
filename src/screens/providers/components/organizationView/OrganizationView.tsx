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
import { Box, Fab } from '@mui/material';
import ModalCreateOrganization from 'modals/ModalCreateOrganization';
import ModalEditOrganization from 'modals/ModalEditOrganization';
import ModalConfirmation from 'modals/ModalConfirmation';
import { sortByColumns } from 'utils/index';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import { fetchOrganizations, fetchCodeSpaces } from 'reducers/OrganizationReducer';
import OrganizationRegisterActions from 'actions/OrganizationRegisterActions';

interface SortOrder {
  column: string;
  asc: boolean;
}

const colSx = {
  display: 'inline-block',
  width: '18%',
  maxWidth: '18%',
  minWidth: '18%',
  m: '2px',
  mb: '5px',
  fontSize: '0.9em',
};

const colIconSx = {
  float: 'right',
  mr: '10px',
  width: 'auto',
  display: 'inline-block',
  cursor: 'pointer',
  m: '2px',
  mb: '5px',
  fontSize: '0.9em',
};

const sortableSx = {
  borderBottom: '1px dotted',
  cursor: 'pointer',
};

const OrganizationView = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const organizations = useAppSelector((state: any) => state.OrganizationReducer.organizations);
  const codeSpaces = useAppSelector((state: any) => state.OrganizationReducer.codeSpaces);
  const status = useAppSelector((state: any) => state.OrganizationReducer.organizationStatus);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [activeOrganization, setActiveOrganization] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>({ column: 'name', asc: true });

  useEffect(() => {
    dispatch(fetchOrganizations(getToken));
    dispatch(fetchCodeSpaces(getToken));
  }, [dispatch, getToken]);

  // Mirror componentDidUpdate: when status changes to error: null while a modal is open, close.
  useEffect(() => {
    if (status && status.error === null && (isCreateModalOpen || isEditModalOpen)) {
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSortOrder = (column: string) => {
    let asc = true;
    if (sortOrder.column === column) {
      asc = !sortOrder.asc;
    }
    setSortOrder({ column, asc });
  };

  const handleCloseDeleteConfirmation = () => {
    setActiveOrganization(null);
    setIsDeleteConfirmationOpen(false);
  };

  const handleCreateOrganization = (organization: any) => {
    dispatch(OrganizationRegisterActions.createOrganization(organization, getToken));
  };

  const handleUpdateOrganization = (organization: any) => {
    dispatch(OrganizationRegisterActions.updateOrganization(organization, getToken));
  };

  const handleEditOrganization = (organization: any) => {
    setActiveOrganization(organization);
    setIsEditModalOpen(true);
  };

  const handleDeleteOrganization = (organization: any) => {
    handleCloseDeleteConfirmation();
    dispatch(OrganizationRegisterActions.deleteOrganization(organization.id, getToken));
  };

  const handleOpenDeleteConfirmationDialog = (organization: any) => {
    setActiveOrganization(organization);
    setIsDeleteConfirmationOpen(true);
  };

  const getDeleteConfirmationTitle = () => {
    const organization = activeOrganization ? activeOrganization.name : 'N/A';
    return `Delete organization ${organization}`;
  };

  const sortedOrganizations = sortByColumns(organizations, sortOrder);
  const confirmDeleteTitle = getDeleteConfirmationTitle();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Fab
          size="small"
          style={{ float: 'right', marginRight: 10, cursor: 'pointer' }}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Add />
        </Fab>
      </div>
      <Box>
        <Box
          sx={{
            fontWeight: 600,
            textTransform: 'uppercase',
            bgcolor: 'rgba(238, 238, 238, 0.28)',
            mb: '5px',
          }}
        >
          <Box sx={colSx}>
            <Box component="span" onClick={() => handleSortOrder('name')} sx={sortableSx}>
              name
            </Box>
          </Box>
          <Box sx={colSx}>
            <Box component="span" onClick={() => handleSortOrder('id')} sx={sortableSx}>
              id
            </Box>
          </Box>
          <Box sx={colSx}>
            <Box
              component="span"
              onClick={() => handleSortOrder('organisationType')}
              sx={sortableSx}
            >
              organisation type
            </Box>
          </Box>
          <Box sx={colSx}>
            <Box component="span" onClick={() => handleSortOrder('privateCode')} sx={sortableSx}>
              private code
            </Box>
          </Box>
          <Box sx={colSx}>
            <Box component="span" onClick={() => handleSortOrder('codeSpace')} sx={sortableSx}>
              code space
            </Box>
          </Box>
        </Box>
        {sortedOrganizations.map((organization: any) => {
          return (
            <Box
              key={'organization-' + organization.id}
              sx={{ '&:nth-of-type(even)': { bgcolor: 'hsla(0, 0%, 50%, 0.07)' } }}
            >
              <Box sx={colSx}>{organization.name}</Box>
              <Box sx={colSx}>{organization.id}</Box>
              <Box sx={colSx}>{organization.organisationType}</Box>
              <Box sx={colSx}>{organization.privateCode}</Box>
              <Box sx={colSx}>{organization.codeSpace}</Box>
              <Box sx={colIconSx}>
                <Delete
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 10,
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    color: '#fa7b81',
                  }}
                  onClick={() => handleOpenDeleteConfirmationDialog(organization)}
                />
                <Edit
                  onClick={() => handleEditOrganization(organization)}
                  style={{
                    height: 20,
                    width: 20,
                    verticalAlign: 'middle',
                    color: 'rgba(25, 118, 210, 0.59)',
                  }}
                />
              </Box>
            </Box>
          );
        })}
        {isCreateModalOpen ? (
          <ModalCreateOrganization
            isModalOpen={isCreateModalOpen}
            handleCloseModal={() => setIsCreateModalOpen(false)}
            takenOrganizationNames={organizations.map((org: any) => org.name)}
            takenOrganizationPrivateCodes={organizations.map((org: any) => org.privateCode)}
            codeSpaces={codeSpaces}
            handleSubmit={handleCreateOrganization}
          />
        ) : null}

        {isEditModalOpen ? (
          <ModalEditOrganization
            isModalOpen={isEditModalOpen}
            handleCloseModal={() => setIsEditModalOpen(false)}
            takenOrganizationNames={organizations.map((org: any) => org.name)}
            takenOrganizationPrivateCodes={organizations.map((org: any) => org.privateCode)}
            organization={activeOrganization}
            codeSpaces={codeSpaces}
            handleSubmit={handleUpdateOrganization}
          />
        ) : null}
        <ModalConfirmation
          open={isDeleteConfirmationOpen}
          title={confirmDeleteTitle}
          actionBtnTitle="Delete"
          body="You are about to delete current organization. Are you sure?"
          handleSubmit={() => {
            handleDeleteOrganization(activeOrganization);
          }}
          handleClose={() => {
            handleCloseDeleteConfirmation();
          }}
        />
      </Box>
    </div>
  );
};

export default OrganizationView;
