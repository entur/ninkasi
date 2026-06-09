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
import EmptyState from '@/app/components/EmptyState';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getPaginationMap } from '@/models';
import { format } from 'date-fns';
import * as MardukReducer from 'reducers/MardukReducer';
const {
  cancelChouetteJobForProvider,
  cancelAllChouetteJobsforProvider,
  toggleChouetteInfoCheckboxFilterAndRefetch,
  setActiveActionFilter,
} = MardukReducer as any;
import { sortChouetteByColumn } from 'reducers/UtilsReducer';

const ChouetteJobDetails = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const activeId = useAppSelector(state => state.SuppliersReducer.activeId);
  const chouetteJobStatus = useAppSelector(state => state.MardukReducer.chouetteJobStatus);
  const sortProperty = useAppSelector(state => state.UtilsReducer.chouetteListSortOrder.property);
  const sortOrder = useAppSelector(state => state.UtilsReducer.chouetteListSortOrder.sortOrder);
  const chouetteJobFilter = useAppSelector(state => state.MardukReducer.chouetteJobFilter);
  const requestingJobs = useAppSelector(state => state.MardukReducer.requesting_chouette_job);

  const [activeChouettePageIndex, setActiveChouettePageIndex] = useState(0);
  const [filterFromDate, setFilterFromDate] = useState<any>(null);

  useEffect(() => {
    cfgreader.readConfig(function (config: any) {
      window.config = config;
    });
  }, []);

  const getJobStatus = (status: string) => {
    if (status === 'TERMINATED') return 'COMPLETED';
    return status;
  };

  const handleCancelChouetteJob = (index: number | string) => {
    dispatch(cancelChouetteJobForProvider({ providerId: activeId, chouetteId: index, getToken }));
  };

  const handleCancelAllChouetteJobs = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(cancelAllChouetteJobsforProvider({ providerId: activeId, getToken }));
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      toggleChouetteInfoCheckboxFilterAndRefetch(event.target.name, event.target.checked, getToken)
    );
  };

  const handlePageClick = (e: React.MouseEvent, pageIndex: number) => {
    e.preventDefault();
    setActiveChouettePageIndex(pageIndex);
  };

  const handleSetActiveActionFilter = (value: string) => {
    dispatch(setActiveActionFilter(value, getToken));
  };

  const handleSortForColumn = (columnName: string) => {
    dispatch(sortChouetteByColumn(columnName));
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  };

  const paginationMap = getPaginationMap(
    chouetteJobStatus,
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
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Status
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={event => {
                      event.stopPropagation();
                      handleStatusFilterChange(event);
                    }}
                    defaultChecked={chouetteJobFilter.SCHEDULED}
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
                      handleStatusFilterChange(event);
                    }}
                    defaultChecked={chouetteJobFilter.RESCHEDULED}
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
                      handleStatusFilterChange(event);
                    }}
                    defaultChecked={chouetteJobFilter.STARTED}
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
                      handleStatusFilterChange(event);
                    }}
                    defaultChecked={chouetteJobFilter.TERMINATED}
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
                      handleStatusFilterChange(event);
                    }}
                    defaultChecked={chouetteJobFilter.CANCELED}
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
                      handleStatusFilterChange(event);
                    }}
                    defaultChecked={chouetteJobFilter.ABORTED}
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
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
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
                    handleSetActiveActionFilter(value);
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            key={'btn-delete-all'}
            onClick={handleCancelAllChouetteJobs}
            size="small"
            color="error"
            variant="contained"
          >
            Cancel all
          </Button>
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
                const isError = job.status === 'ABORTED' || job.status === 'CANCELED';

                return (
                  <TableRow key={'ch-job-' + index}>
                    <TableCell sx={{ py: 1, px: 1 }}>
                      <ChouetteLink id={job.id} action={job.action} referential={job.referential}>
                        {job.id}
                      </ChouetteLink>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>{job.action}</TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>{formatDate(job.created)}</TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>{formatDate(job.started)}</TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>{formatDate(job.updated)}</TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>
                      <Box component="span" sx={{ color: isError ? 'error.main' : 'success.main' }}>
                        {getJobStatus(job.status)}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1, px: 1 }}>
                      {job.status === 'STARTED' ||
                      job.status === 'SCHEDULED' ||
                      job.status === 'RESCHEDULED' ? (
                        <Button
                          key={'btn-delete-' + index}
                          onClick={() => handleCancelChouetteJob(job.id)}
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
          <EmptyState message="No chouette jobs found for your search criterias." />
        )}
      </Paper>
    </Container>
  );
};

export default ChouetteJobDetails;
