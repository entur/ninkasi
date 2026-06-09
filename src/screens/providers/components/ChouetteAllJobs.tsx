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
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import cfgreader from 'config/readConfig';
import {
  Container,
  Paper,
  Grid as MuiGrid,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from '@mui/material';
const Grid = MuiGrid as any;
import ChouetteLink from './ChouetteLink';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getPaginationMap } from '@/models';
import { format } from 'date-fns';
import * as MardukReducer from 'reducers/MardukReducer';
const {
  getChouetteJobsForAllSuppliers,
  cancelChouetteJobForProvider,
  toggleChouetteInfoCheckboxAllFilterAndRefetch,
  setActiveActionAllFilter,
} = MardukReducer as any;
import { sortChouetteAllByColumn } from 'reducers/UtilsReducer';

const ChouetteAllJobs = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const chouetteJobAllFilter = useAppSelector(state => state.MardukReducer.chouetteJobAllFilter);
  const chouetteAllJobStatus = useAppSelector(
    state => state.MardukReducer.chouetteAllJobStatus || []
  );
  const sortProperty = useAppSelector(
    state => state.UtilsReducer.chouetteListAllSortOrder.property
  );
  const sortOrder = useAppSelector(state => state.UtilsReducer.chouetteListAllSortOrder.sortOrder);
  const requestingJobs = useAppSelector(state => state.MardukReducer.requesting_chouette_all_job);

  const [activeChouettePageIndex, setActiveChouettePageIndex] = useState(0);
  const [filterFromDate, setFilterFromDate] = useState<any>(null);

  useEffect(() => {
    cfgreader.readConfig(function (config: any) {
      window.config = config;
      dispatch(getChouetteJobsForAllSuppliers(getToken));
    });
  }, [dispatch, getToken]);

  const handleCancelChouetteJob = (id: number | string, providerId: number) => {
    dispatch(cancelChouetteJobForProvider({ providerId, chouetteId: id, getToken }));
  };

  const handleStatusFilterAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      toggleChouetteInfoCheckboxAllFilterAndRefetch(
        event.target.name,
        event.target.checked,
        getToken
      )
    );
  };

  const handlePageClick = (e: React.MouseEvent, pageIndex: number) => {
    e.preventDefault();
    setActiveChouettePageIndex(pageIndex);
  };

  const handleSetActiveActionAllFilter = (value: string) => {
    dispatch(setActiveActionAllFilter(value, getToken));
  };

  const handleSortForColumn = (columnName: string) => {
    dispatch(sortChouetteAllByColumn(columnName));
  };

  const getJobStatus = (status: string) => {
    if (status === 'TERMINATED') return 'COMPLETED';
    return status;
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  };

  const paginationMap = getPaginationMap(
    chouetteAllJobStatus,
    sortProperty,
    sortOrder,
    filterFromDate
  );
  const page = paginationMap ? paginationMap[activeChouettePageIndex] : null;

  return (
    <Container maxWidth={false}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                Status
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={event => {
                      event.stopPropagation();
                      handleStatusFilterAllChange(event);
                    }}
                    defaultChecked={chouetteJobAllFilter.SCHEDULED}
                    name="SCHEDULED"
                  />
                }
                label="Scheduled"
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={event => {
                      event.stopPropagation();
                      handleStatusFilterAllChange(event);
                    }}
                    defaultChecked={chouetteJobAllFilter.RESCHEDULED}
                    name="RESCHEDULED"
                  />
                }
                label="Rescheduled"
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={event => {
                      event.stopPropagation();
                      handleStatusFilterAllChange(event);
                    }}
                    defaultChecked={chouetteJobAllFilter.STARTED}
                    name="STARTED"
                  />
                }
                label="Started"
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={event => {
                      event.stopPropagation();
                      handleStatusFilterAllChange(event);
                    }}
                    defaultChecked={chouetteJobAllFilter.TERMINATED}
                    name="TERMINATED"
                  />
                }
                label="Completed"
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={event => {
                      event.stopPropagation();
                      handleStatusFilterAllChange(event);
                    }}
                    defaultChecked={chouetteJobAllFilter.CANCELED}
                    name="CANCELED"
                  />
                }
                label="Canceled"
              />
            </Grid>
            <Grid item xs={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={event => {
                      event.stopPropagation();
                      handleStatusFilterAllChange(event);
                    }}
                    defaultChecked={chouetteJobAllFilter.ABORTED}
                    name="ABORTED"
                  />
                }
                label="Aborted/Error"
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="baseline">
            <Grid item xs={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                Action
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <FormControl>
                <RadioGroup
                  row
                  defaultValue=""
                  name="action-filter"
                  onChange={(event, value) => {
                    event.stopPropagation();
                    event.preventDefault();
                    handleSetActiveActionAllFilter(value);
                  }}
                >
                  <FormControlLabel value="" control={<Radio />} label="No filter" />
                  <FormControlLabel value="importer" control={<Radio />} label="Importer" />
                  <FormControlLabel value="exporter" control={<Radio />} label="Exporter" />
                  <FormControlLabel value="validator" control={<Radio />} label="Validator" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From ..."
                  value={filterFromDate}
                  onChange={(newValue: any) => {
                    setFilterFromDate(newValue);
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          {paginationMap.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="body2">Pages:</Typography>
              {paginationMap.map((_p: any, index: number) => (
                <Button
                  key={'link-' + index}
                  size="small"
                  variant={index === activeChouettePageIndex ? 'contained' : 'outlined'}
                  onClick={e => handlePageClick(e, index)}
                  sx={{ minWidth: '32px', px: 1 }}
                >
                  {index}
                </Button>
              ))}
            </Box>
          )}
          {requestingJobs && (
            <Box sx={{ mx: 2.5, mb: 1.25 }}>
              <CircularProgress size={23} sx={{ color: '#26A65B' }} />
            </Box>
          )}
        </Box>
        {page && page.length ? (
          <Table size="small" sx={{ width: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ cursor: 'pointer', fontWeight: 'bold', py: 1, px: 1 }}
                  onClick={() => handleSortForColumn('referential')}
                >
                  Provider
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', fontWeight: 'bold', py: 1, px: 1 }}
                  onClick={() => handleSortForColumn('id')}
                >
                  Id
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', fontWeight: 'bold', py: 1, px: 1 }}
                  onClick={() => handleSortForColumn('action')}
                >
                  Action
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', fontWeight: 'bold', py: 1, px: 1 }}
                  onClick={() => handleSortForColumn('created')}
                >
                  Created
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', fontWeight: 'bold', py: 1, px: 1 }}
                  onClick={() => handleSortForColumn('started')}
                >
                  Started
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', fontWeight: 'bold', py: 1, px: 1 }}
                  onClick={() => handleSortForColumn('updated')}
                >
                  Updated
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', fontWeight: 'bold', py: 1, px: 1 }}
                  onClick={() => handleSortForColumn('status')}
                >
                  Status
                </TableCell>
                <TableCell sx={{ py: 1, px: 1 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {page.map((job: any, index: number) => {
                const statusClass =
                  job.status === 'ABORTED' || job.status === 'CANCELED' ? 'error' : 'success';
                const chouetteURL = `${(window.config as any).chouetteBaseUrl}/referentials/${job.referential}/`;

                return (
                  <TableRow key={'ch-job-' + index}>
                    <TableCell sx={{ py: 1, px: 1 }}>
                      <a
                        title={chouetteURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={chouetteURL}
                      >
                        {job.referential}
                      </a>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>
                      <ChouetteLink id={job.id} referential={job.referential} action={job.action}>
                        {job.id}
                      </ChouetteLink>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>{job.action}</TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>{formatDate(job.created)}</TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>{formatDate(job.started)}</TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>{formatDate(job.updated)}</TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>
                      <span className={statusClass}>{getJobStatus(job.status)}</span>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>
                      {job.status === 'STARTED' ||
                      job.status === 'SCHEDULED' ||
                      job.status === 'RESCHEDULED' ? (
                        <Button
                          key={'btn-delete-' + index}
                          onClick={() => handleCancelChouetteJob(job.id, job.providerId)}
                          size="small"
                          color="error"
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ p: 2.5 }}>
            <Typography>No chouette jobs found for your search criterias.</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ChouetteAllJobs;
