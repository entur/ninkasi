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
          <Box>
            <div>
              {paginationMap.length > 0 ? (
                <div className="page-link-parent">
                  <span>Pages: </span>
                  {paginationMap.map((page, index) => {
                    const isActive =
                      index === activeChouettePageIndex
                        ? 'page-link active-link'
                        : 'page-link inactive-link';
                    return (
                      <span
                        className={isActive}
                        onClick={e => this.handlePageClick(e, index)}
                        key={'link-' + index}
                      >
                        {index}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div />
              )}
            </div>
            {requestingJobs ? (
              <div style={{ margin: '0px 20px 10px' }}>
                <Loader color="#26A65B" size="23px" />
              </div>
            ) : null}
          </Box>
          {page && page.length ? (
            <Row>
              <Col md="1">
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('referential')}
                >
                  Provider
                </div>
              </Col>
              <Col md="1">
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('id')}
                >
                  Id
                </div>
              </Col>
              <Col md="1">
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('action')}
                >
                  Action
                </div>
              </Col>
              <Col md="2">
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('created')}
                >
                  Created
                </div>
              </Col>
              <Col md="2">
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('started')}
                >
                  Started
                </div>
              </Col>
              <Col md="2">
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('updated')}
                >
                  Updated
                </div>
              </Col>
              <Col md="1">
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('status')}
                >
                  Status
                </div>
              </Col>
            </Row>
          ) : (
            <Row>
              <p style={{ marginLeft: '20px' }}>
                No chouette jobs found for your search criterias.
              </p>
            </Row>
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
                  <Row
                    key={'ch-job-' + index}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Col md="1">
                      <a
                        title={chouetteURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={chouetteURL}
                      >
                        {job.referential}
                      </a>
                    </Col>
                    <Col md="1">
                      <ChouetteLink
                        id={job.id}
                        referential={job.referential}
                        action={job.action}
                      >
                        {job.id}
                      </ChouetteLink>
                    </Col>
                    <Col md="1">
                      <p>{job.action}</p>
                    </Col>
                    <Col md="2">
                      <p>{this.formatDate(job.created)}</p>
                    </Col>
                    <Col md="2">
                      <p>{this.formatDate(job.started)}</p>
                    </Col>
                    <Col md="2">
                      <p>{this.formatDate(job.updated)}</p>
                    </Col>
                    <Col md="1">
                      <p>
                        <span className={statusClass}>
                          {this.getJobStatus(job.status)}
                        </span>
                      </p>
                    </Col>
                    {job.status === 'STARTED' ||
                    job.status === 'SCHEDULED' ||
                    job.status === 'RESCHEDULED' ? (
                      <Col md="1">
                        <Button
                          key={'btn-delete-' + index}
                          onClick={() =>
                            this.handleCancelChouetteJob(job.id, job.providerId)
                          }
                          size="small"
                          color="danger"
                        >
                          Cancel
                        </Button>
                      </Col>
                    ) : (
                      <div />
                    )}
                  </Row>
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
