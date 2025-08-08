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
import withAuth from 'utils/withAuth';
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
import { DotLoader as Loader } from 'halogenium';
import SuppliersActions from 'actions/SuppliersActions';
import ChouetteLink from './ChouetteLink';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TextField } from '@mui/material';
import { getPaginationMap } from 'models';
import moment from 'moment';

class ChouetteAllJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeChouettePageIndex: 0,
      filterFromDate: null
    };
  }

  componentWillMount() {
    const { dispatch, getToken } = this.props;
    cfgreader.readConfig(function(config) {
      window.config = config;
      dispatch(SuppliersActions.getChouetteJobsForAllSuppliers(getToken));
    });
  }

  handleCancelChouetteJob = (id, providerId) => {
    const { getToken } = this.props;
    this.props.dispatch(
      SuppliersActions.cancelChouetteJobForProvider(providerId, id, getToken)
    );
  };

  handleStatusFilterAllChange = event => {
    const { getToken } = this.props;
    this.props.dispatch(
      SuppliersActions.toggleChouetteInfoCheckboxAllFilter(
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

  setActiveActionAllFilter(event) {
    if (event.target.name === 'action-filter') {
      const { dispatch, getToken } = this.props;
      dispatch(
        SuppliersActions.setActiveActionAllFilter(event.target.value, getToken)
      );
    }
  }

  handleSortForColumn(columnName) {
    const { dispatch } = this.props;
    dispatch(SuppliersActions.sortListByColumn('chouetteAll', columnName));
  }

  getJobStatus(status) {
    if (status === 'TERMINATED') return 'COMPLETED';
    return status;
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
      chouetteJobAllFilter,
      requestingJobs,
      chouetteAllJobStatus,
      sortProperty,
      sortOrder
    } = this.props;
    const { activeChouettePageIndex, filterFromDate } = this.state;
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
                        this.handleStatusFilterAllChange(event);
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
                        this.handleStatusFilterAllChange(event);
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
                        this.handleStatusFilterAllChange(event);
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
                        this.handleStatusFilterAllChange(event);
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
                        this.handleStatusFilterAllChange(event);
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
                        this.handleStatusFilterAllChange(event);
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
                      // Create a synthetic event with the target structure expected by setActiveActionAllFilter
                      const syntheticEvent = {
                        target: {
                          name: 'action-filter',
                          value: value
                        }
                      };
                      this.setActiveActionAllFilter(syntheticEvent);
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
                  onClick={() => this.handleSortForColumn('referential')}
                >
                  Provider
                </div>
              </Grid>
              <Grid item xs={1}>
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('id')}
                >
                  Id
                </div>
              </Grid>
              <Grid item xs={1}>
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
              {' '}
              {page.map((job, index) => {
                const statusClass =
                  job.status === 'ABORTED' || job.status === 'CANCELED'
                    ? 'error'
                    : 'success';
                const chouetteURL = `${window.config.chouetteBaseUrl}/referentials/${job.referential}/`;

                return (
                  <Grid
                    container
                    spacing={1}
                    key={'ch-job-' + index}
                    sx={{ alignItems: 'center', py: 1 }}
                  >
                    <Grid item xs={1}>
                      <a
                        title={chouetteURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={chouetteURL}
                      >
                        {job.referential}
                      </a>
                    </Grid>
                    <Grid item xs={1}>
                      <ChouetteLink
                        id={job.id}
                        referential={job.referential}
                        action={job.action}
                      >
                        {job.id}
                      </ChouetteLink>
                    </Grid>
                    <Grid item xs={1}>
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
                          onClick={() =>
                            this.handleCancelChouetteJob(job.id, job.providerId)
                          }
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
            <div />
          )}
        </Paper>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    chouetteJobAllFilter: state.MardukReducer.chouetteJobAllFilter,
    chouetteAllJobStatus: state.MardukReducer.chouetteAllJobStatus || [],
    sortProperty: state.UtilsReducer.chouetteListAllSortOrder.property,
    sortOrder: state.UtilsReducer.chouetteListAllSortOrder.sortOrder,
    actionAllFilter: state.MardukReducer.actionAllFilter,
    requestingJobs: state.MardukReducer.requesting_chouette_all_job
  };
};

export default connect(mapStateToProps)(withAuth(ChouetteAllJobs));
