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

import React from 'react';
import { connect } from 'react-redux';
import cfgreader from 'config/readConfig';
import {
  Container,
  Paper,
  Grid,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Box,
  Typography
} from '@mui/material';
import SuppliersActions from 'actions/SuppliersActions';
import { DotLoader as Loader } from 'halogenium';
import ChouetteLink from './ChouetteLink';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TextField } from '@mui/material';
import { getPaginationMap } from 'models';
import moment from 'moment';

class ChouetteJobDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeChouettePageIndex: 0,
      filterFromDate: null
    };
  }

  componentWillMount() {
    cfgreader.readConfig(function(config) {
      window.config = config;
    });
  }

  getJobStatus(status) {
    if (status === 'TERMINATED') return 'COMPLETED';
    return status;
  }

  handleCancelChouetteJob = index => {
    const { dispatch, activeId, getToken } = this.props;
    dispatch(
      SuppliersActions.cancelChouetteJobForProvider(activeId, index, getToken)
    );
  };

  handleCancelAllChouetteJobs = event => {
    event.preventDefault();
    const { dispatch, activeId, getToken } = this.props;
    dispatch(
      SuppliersActions.cancelAllChouetteJobsforProvider(activeId, getToken)
    );
  };

  handleStatusFilterChange = event => {
    const { dispatch, getToken } = this.props;
    dispatch(
      SuppliersActions.toggleChouetteInfoCheckboxFilter(
        event.target.name,
        event.target.checked,
        getToken
      )
    );
  };

  handlePageClick(e, pageIndex) {
    e.preventDefault();
    this.setState({
      activeChouettePageIndex: pageIndex
    });
  }

  setActiveActionFilter(event) {
    if (event.target.name === 'action-filter') {
      const { dispatch, getToken } = this.props;
      dispatch(
        SuppliersActions.setActiveActionFilter(event.target.value, getToken)
      );
    }
  }

  handleSortForColumn(columnName) {
    const { dispatch } = this.props;
    dispatch(SuppliersActions.sortListByColumn('chouette', columnName));
  }

  handleOnDatePickerChange(event, date) {
    this.setState({
      filterFromDate: date
    });
  }

  formatDate(date) {
    if (!date) return '';
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

  render() {
    const {
      chouetteJobFilter,
      requestingJobs,
      chouetteJobStatus,
      sortProperty,
      sortOrder
    } = this.props;
    const { activeChouettePageIndex, filterFromDate } = this.state;
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
                        this.handleStatusFilterChange(event);
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
                        this.handleStatusFilterChange(event);
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
                        this.handleStatusFilterChange(event);
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
                        this.handleStatusFilterChange(event);
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
                        this.handleStatusFilterChange(event);
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
                        this.handleStatusFilterChange(event);
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
                      // Create a synthetic event with the target structure expected by setActiveActionFilter
                      const syntheticEvent = {
                        target: {
                          name: 'action-filter',
                          value: value
                        }
                      };
                      this.setActiveActionFilter(syntheticEvent);
                    }}
                  >
                    <FormControlLabel
                      value=""
                      control={<Radio />}
                      label="No filter"
                    />
                    <FormControlLabel
                      value="importer"
                      control={<Radio />}
                      label="Importer"
                    />
                    <FormControlLabel
                      value="exporter"
                      control={<Radio />}
                      label="Exporter"
                    />
                    <FormControlLabel
                      value="validator"
                      control={<Radio />}
                      label="Validator"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="From ..."
                    value={this.state.filterFromDate}
                    onChange={newValue => {
                      this.setState({ filterFromDate: newValue });
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              key={'btn-delete-all'}
              onClick={this.handleCancelAllChouetteJobs}
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
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <Typography variant="body2">Pages:</Typography>
                {paginationMap.map((page, index) => (
                  <Button
                    key={'link-' + index}
                    size="small"
                    variant={
                      index === activeChouettePageIndex
                        ? 'contained'
                        : 'outlined'
                    }
                    onClick={e => this.handlePageClick(e, index)}
                    sx={{ minWidth: '32px', px: 1 }}
                  >
                    {index}
                  </Button>
                ))}
              </Box>
            )}
            {requestingJobs && (
              <Box sx={{ mx: 2.5, mb: 1.25 }}>
                <Loader color="#26A65B" size="23px" />
              </Box>
            )}
          </Box>
          {page && page.length ? (
            <Grid container spacing={1}>
              <Grid item xs={1}>
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('id')}
                >
                  Id
                </div>
              </Grid>
              <Grid item xs={2}>
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('action')}
                >
                  Action
                </div>
              </Grid>
              <Grid item xs={2}>
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('created')}
                >
                  Created
                </div>
              </Grid>
              <Grid item xs={2}>
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('started')}
                >
                  Started
                </div>
              </Grid>
              <Grid item xs={2}>
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('updated')}
                >
                  Updated
                </div>
              </Grid>
              <Grid item xs={1}>
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('status')}
                >
                  Status
                </div>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ p: 2.5 }}>
              <Typography>
                No chouette jobs found for your search criterias.
              </Typography>
            </Box>
          )}
          {page && page.length ? (
            <Box>
              {page.map((job, index) => {
                const statusClass =
                  job.status === 'ABORTED' || job.status === 'CANCELED'
                    ? 'error'
                    : 'success';

                return (
                  <Grid
                    container
                    spacing={1}
                    key={'ch-job-' + index}
                    sx={{ alignItems: 'center', py: 1 }}
                  >
                    <Grid item xs={1}>
                      <ChouetteLink
                        id={job.id}
                        action={job.action}
                        referential={job.referential}
                      >
                        {job.id}
                      </ChouetteLink>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="body2">{job.action}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="body2">
                        {this.formatDate(job.created)}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="body2">
                        {this.formatDate(job.started)}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="body2">
                        {this.formatDate(job.updated)}
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="body2">
                        <span className={statusClass}>
                          {this.getJobStatus(job.status)}
                        </span>
                      </Typography>
                    </Grid>
                    {job.status === 'STARTED' ||
                    job.status === 'SCHEDULED' ||
                    job.status === 'RESCHEDULED' ? (
                      <Grid item xs={1}>
                        <Button
                          key={'btn-delete-' + index}
                          onClick={() => this.handleCancelChouetteJob(job.id)}
                          size="small"
                          color="error"
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                      </Grid>
                    ) : (
                      <Grid item xs={1} />
                    )}
                  </Grid>
                );
              })}
            </Box>
          ) : (
            <Box />
          )}
        </Paper>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  activeId: state.SuppliersReducer.activeId,
  chouetteJobStatus: state.MardukReducer.chouetteJobStatus,
  sortProperty: state.UtilsReducer.chouetteListSortOrder.property,
  sortOrder: state.UtilsReducer.chouetteListSortOrder.sortOrder,
  chouetteJobFilter: state.MardukReducer.chouetteJobFilter,
  actionFilter: state.MardukReducer.actionFilter,
  requestingJobs: state.MardukReducer.requesting_chouette_job
});

export default connect(mapStateToProps)(ChouetteJobDetails);
