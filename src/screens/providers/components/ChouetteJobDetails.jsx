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
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Button from 'muicss/lib/react/button';
import Checkbox from 'muicss/lib/react/checkbox';
import Radio from 'muicss/lib/react/radio';
import Form from 'muicss/lib/react/form';
import Panel from 'muicss/lib/react/panel';
import SuppliersActions from 'actions/SuppliersActions';
import { DotLoader as Loader } from 'halogenium';
import ChouetteLink from './ChouetteLink';
import { DatePicker } from '@mui/lab';
import { TextField } from '@mui/material';
import { Clear } from '@mui/icons-material';
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
      <div>
        <Container fluid={true}>
          <Panel>
            <div className="filter-wrapper">
              <Row>
                <Col md="1">
                  <p>
                    <b>Status</b>
                  </p>
                </Col>
                <Col md="2">
                  <Checkbox
                    onChange={event => this.handleStatusFilterChange(event)}
                    defaultChecked={chouetteJobFilter.SCHEDULED}
                    name="SCHEDULED"
                    label="Scheduled"
                  />
                </Col>
                <Col md="2">
                  <Checkbox
                    onChange={event => this.handleStatusFilterChange(event)}
                    defaultChecked={chouetteJobFilter.RESCHEDULED}
                    name="RESCHEDULED"
                    label="Rescheduled"
                  />
                </Col>
                <Col md="2">
                  <Checkbox
                    onChange={event => this.handleStatusFilterChange(event)}
                    defaultChecked={chouetteJobFilter.STARTED}
                    name="STARTED"
                    label="Started"
                  />
                </Col>
                <Col md="2">
                  <Checkbox
                    onChange={event => this.handleStatusFilterChange(event)}
                    defaultChecked={chouetteJobFilter.TERMINATED}
                    name="TERMINATED"
                    label="Completed"
                  />
                </Col>
                <Col md="2">
                  <Checkbox
                    onChange={event => this.handleStatusFilterChange(event)}
                    defaultChecked={chouetteJobFilter.CANCELED}
                    name="CANCELED"
                    label="Canceled"
                  />
                </Col>
                <Col md="1">
                  <Checkbox
                    onChange={event => this.handleStatusFilterChange(event)}
                    defaultChecked={chouetteJobFilter.ABORTED}
                    name="ABORTED"
                    label="Aborted/Error"
                  />
                </Col>
              </Row>
            </div>
            <div className="filter-wrapper">
              <Row>
                <Col md="1">
                  <p>
                    <b>Action</b>
                  </p>
                </Col>
                <Form>
                  <Col md="2">
                    <Radio
                      onClick={event => this.setActiveActionFilter(event)}
                      value=""
                      name="action-filter"
                      label="No filter"
                      defaultChecked={true}
                    />
                  </Col>
                  <Col md="2">
                    <Radio
                      onClick={event => this.setActiveActionFilter(event)}
                      value="importer"
                      name="action-filter"
                      label="Importer"
                    />
                  </Col>
                  <Col md="2">
                    <Radio
                      onClick={event => this.setActiveActionFilter(event)}
                      value="exporter"
                      name="action-filter"
                      label="Exporter"
                    />
                  </Col>
                  <Col md="2">
                    <Radio
                      onClick={event => this.setActiveActionFilter(event)}
                      value="validator"
                      name="action-filter"
                      label="Validator"
                    />
                  </Col>
                  <Col md="4">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Clear
                        onClick={() => this.setState({ filterFromDate: null })}
                        style={{ marginRight: 5 }}
                      />
                      <DatePicker
                        label="Filter from date"
                        value={this.state.filterFromDate}
                        onChange={newValue => {
                          this.setState({ filterFromDate: newValue });
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            style={{ display: 'inline-block' }}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <div style={{ float: 'right', marginRight: 10 }}>
                    <Button
                      key={'btn-delete-all'}
                      onClick={this.handleCancelAllChouetteJobs}
                      size="small"
                      color="danger"
                    >
                      Cancel all
                    </Button>
                  </div>
                </Form>
              </Row>
            </div>
          </Panel>
          <Row>
            <Col md="10">
              {paginationMap.length > 0 ? (
                <div className="page-link-parent lm-17">
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
            </Col>
            {requestingJobs ? (
              <div style={{ margin: '0px 20px 10px' }}>
                <Loader color="#26A65B" size="23px" />
              </div>
            ) : null}
          </Row>
          {page && page.length ? (
            <Row>
              <Col md="1">
                <div
                  className="table-header"
                  onClick={() => this.handleSortForColumn('id')}
                >
                  Id
                </div>
              </Col>
              <Col md="2">
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
        </Container>
        {page && page.length ? (
          <Container fluid={true}>
            {' '}
            {page.map((job, index) => {
              const statusClass =
                job.status === 'ABORTED' || job.status === 'CANCELED'
                  ? 'error'
                  : 'success';

              return (
                <Row
                  key={'ch-job-' + index}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Col md="1">
                    <ChouetteLink
                      id={job.id}
                      action={job.action}
                      referential={job.referential}
                    >
                      {job.id}
                    </ChouetteLink>
                  </Col>
                  <Col md="2">
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
                        onClick={() => this.handleCancelChouetteJob(job.id)}
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
          </Container>
        ) : (
          <div />
        )}
      </div>
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
