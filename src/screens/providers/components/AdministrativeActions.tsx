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

import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import { Box, Menu, MenuItem } from '@mui/material';
import { Warning, ArrowDropDown, KeyboardArrowRight } from '@mui/icons-material';
import Button from '@mui/material/Button';
import ConfirmDialog from '../../../modals/ConfirmDialog';
import * as MardukReducer from 'reducers/MardukReducer';
const {
  buildGraph,
  buildBaseGraph,
  buildCandidateGraphOTP,
  buildCandidateBaseGraphOTP,
  fetchOSM,
  cleanStopPlacesInChouette,
  deleteAllJobs,
  cancelAllChouetteJobsforAllProviders,
  cleanAllDataspaces,
  cleanFileFilter,
} = MardukReducer as any;

const AdministrativeActions = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmInfo, setConfirmInfo] = useState('');
  const [cleanPopoverOpen, setCleanPopoverOpen] = useState(false);
  const [graphPopoverOpen, setGraphPopoverOpen] = useState(false);

  const openConfirm = (title: string, info: string, action: () => void) => {
    setConfirmDialogOpen(true);
    setConfirmTitle(title);
    setConfirmInfo(info);
    setConfirmAction(() => action);
  };

  const closeConfirm = () => {
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const handleBuildGraph = () => {
    openConfirm('Build Transit Graph', 'Are you sure you want to build Transit Graph?', () => {
      dispatch(buildGraph(getToken));
    });
  };

  const handleBuildBaseGraph = () => {
    openConfirm('Build Street Graph', 'Are you sure you want to build Street Graph?', () => {
      dispatch(buildBaseGraph(getToken));
    });
  };

  const handleBuildCandidateGraphOTP = () => {
    openConfirm(
      'Build candidate Transit Graph',
      'Are you sure you want to build candidate Transit Graph?',
      () => {
        dispatch(buildCandidateGraphOTP(getToken));
      }
    );
  };

  const handleBuildCandidateBaseGraphOTP = () => {
    openConfirm(
      'Build candidate Street Graph',
      'Are you sure you want to build candidate Street Graph?',
      () => {
        dispatch(buildCandidateBaseGraphOTP(getToken));
      }
    );
  };

  const handleFetchOSM = () => {
    openConfirm(
      'Fetch Open Street Map Data',
      'Are you sure you want to fetch Open Street Map data?',
      () => {
        dispatch(fetchOSM(getToken));
      }
    );
  };

  const handleCancelAllJobs = () => {
    openConfirm(
      'Cancel all chouette jobs',
      'Are you want to cancel all chouette jobs for all providers?',
      () => {
        dispatch(cancelAllChouetteJobsforAllProviders(getToken));
      }
    );
  };

  const handleCleanAllDataSpaces = (filter: string) => {
    let filterText = '';

    switch (filter) {
      case 'level1':
        filterText = ' in level 1 space';
        break;
      case 'level2':
        filterText = ' in level 2 space';
        break;
      default:
        break;
    }

    openConfirm(
      'Clean Data Spaces',
      `Are you sure you want to clean all dataspaces for all providers${filterText}?`,
      () => {
        dispatch(cleanAllDataspaces(filter, getToken));
      }
    );
    setCleanPopoverOpen(false);
  };

  const handleCleanFileFilter = () => {
    openConfirm('Clean File Filter', 'Are you sure you want to clean file filter?', () => {
      dispatch(cleanFileFilter(getToken));
    });
    setCleanPopoverOpen(false);
  };

  const handleClearEventHistory = () => {
    openConfirm('Clean All Event History', 'Are you want to clean all event history?', () => {
      dispatch(deleteAllJobs(getToken));
    });
    setCleanPopoverOpen(false);
  };

  const handleClearStopPlaces = () => {
    openConfirm(
      'Clean Stop Placee Register in Chouette',
      'Are you want to clean Stop Place Register in Chouette?',
      () => {
        dispatch(cleanStopPlacesInChouette(getToken));
      }
    );
    setCleanPopoverOpen(false);
  };

  const handleGraphOpen = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setGraphPopoverOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCleanOpen = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setCleanPopoverOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const innerContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    borderTop: '1px solid rgba(158, 158, 158, 0.15)',
  };

  const toolTips: Record<string, string> = {
    buildGraph: 'Build Transit Graph for all providers',
    buildBaseGraph: 'Build new Street Graph with OSM and elevation data',
    buildCandidateGraph: 'Build candidate Transit Graph for all providers',
    buildCandidateBaseGraphOTP: 'Build new candidate Street Graph with OSM and elevation data',
    fetchOSM: 'Fetch Open Street Map data',
    cleanFileFilter: 'Clean file filter',
    canceAllJobs: 'Cancel all current chouette jobs',
    cleanEventHistory: 'Clean event history',
  };

  return (
    <Box sx={innerContainerStyle}>
      <Box>
        <Button
          variant="text"
          size="small"
          endIcon={<ArrowDropDown />}
          onClick={handleGraphOpen}
          sx={{ color: '#fff', fontSize: 12, textTransform: 'uppercase' }}
          aria-haspopup="menu"
        >
          Graph
        </Button>
        <Menu
          open={graphPopoverOpen}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          onClose={() => setGraphPopoverOpen(false)}
        >
          <MenuItem
            sx={{ fontSize: '1.1em' }}
            onClick={handleBuildGraph}
            title={toolTips.buildGraph}
          >
            Build Transit Graph
          </MenuItem>
          <MenuItem
            sx={{ fontSize: '1em' }}
            onClick={handleBuildBaseGraph}
            title={toolTips.buildBaseGraph}
          >
            Build Street Graph
          </MenuItem>
          <MenuItem
            sx={{ fontSize: '1em' }}
            onClick={handleBuildCandidateGraphOTP}
            title={toolTips.buildCandidateGraphOTP}
          >
            Build Candidate Transit Graph
          </MenuItem>
          <MenuItem
            sx={{ fontSize: '1em' }}
            onClick={handleBuildCandidateBaseGraphOTP}
            title={toolTips.buildCandidateBaseGraphOTP}
          >
            Build Candidate Street Graph
          </MenuItem>
        </Menu>
        <Button
          variant="text"
          size="small"
          title={toolTips.fetchOSM}
          onClick={handleFetchOSM}
          sx={{ color: '#fff', fontSize: 12, textTransform: 'uppercase' }}
        >
          Fetch OSM
        </Button>
      </Box>
      <Box
        sx={{
          borderLeft: '1px solid #4c4c4c',
          height: 15,
          margin: '10px 0',
        }}
      />
      <Box>
        <Button
          variant="text"
          size="small"
          startIcon={<Warning />}
          endIcon={<ArrowDropDown />}
          onClick={handleCleanOpen}
          sx={{ color: '#fff', fontSize: 12, textTransform: 'uppercase' }}
          aria-haspopup="menu"
        >
          Clean
        </Button>
        <Button
          variant="text"
          size="small"
          startIcon={<Warning />}
          title={toolTips.canceAllJobs}
          onClick={handleCancelAllJobs}
          sx={{ color: '#fff', fontSize: 12, textTransform: 'uppercase' }}
        >
          Cancel all jobs
        </Button>
      </Box>
      <Menu
        open={cleanPopoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        onClose={() => setCleanPopoverOpen(false)}
      >
        <MenuItem
          sx={{ fontSize: '1.1em' }}
          onClick={handleCleanFileFilter}
          title={toolTips.cleanFileFilter}
        >
          Clean file filter
        </MenuItem>
        <MenuItem
          sx={{ fontSize: '1em' }}
          onClick={handleClearEventHistory}
          title={toolTips.cleanEventHistory}
        >
          Clean event history
        </MenuItem>
        <MenuItem
          sx={{ fontSize: '1em' }}
          onClick={handleClearStopPlaces}
          title={toolTips.cleanStopPlacesChouette}
        >
          Clean Stop Places
        </MenuItem>
        <MenuItem
          id="dropdown-clean-all"
          sx={{ fontSize: '1em' }}
          onClick={() => handleCleanAllDataSpaces('all')}
        >
          <KeyboardArrowRight sx={{ marginRight: '8px' }} />
          Clean all
        </MenuItem>
        <MenuItem
          sx={{ fontSize: '1em', paddingLeft: '2em' }}
          onClick={() => handleCleanAllDataSpaces('level1')}
        >
          Clean Level 1
        </MenuItem>
        <MenuItem
          sx={{ fontSize: '1em', paddingLeft: '2em' }}
          onClick={() => handleCleanAllDataSpaces('level2')}
        >
          Clean Level 2
        </MenuItem>
      </Menu>
      <ConfirmDialog
        open={confirmDialogOpen}
        handleSubmit={confirmAction}
        title={confirmTitle}
        info={confirmInfo}
        handleClose={closeConfirm}
      />
    </Box>
  );
};

export default AdministrativeActions;
