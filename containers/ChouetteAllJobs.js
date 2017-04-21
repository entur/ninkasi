import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'
import Button from 'muicss/lib/react/button'
import Checkbox from 'muicss/lib/react/checkbox'
import Radio from 'muicss/lib/react/radio'
import Form from 'muicss/lib/react/form'
import Panel from 'muicss/lib/react/panel'
import Loader from 'halogen/DotLoader'
import SuppliersActions from '../actions/SuppliersActions'
import ChouetteLink from '../components/ChouetteLink'
import DatePicker from 'material-ui/DatePicker'
import MdClear from 'material-ui/svg-icons/content/clear'

class ChouetteAllJobs extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      activeChouettePageIndex: 0,
      filterFromDate: null
    }
  }

  componentWillMount(){
    const {dispatch} = this.props
    cfgreader.readConfig( (function(config) {
      window.config = config
      dispatch(SuppliersActions.getChouetteJobsForAllSuppliers())
    }).bind(this))
  }

  handleCancelChouetteJob = (id, providerId) => {
    this.props.dispatch(SuppliersActions.cancelChouetteJobForProvider(providerId, id))
  }

  handleStatusFilterAllChange = (event) => {
    this.props.dispatch(SuppliersActions.toggleChouetteInfoCheckboxAllFilter(event.target.name, event.target.checked))
  }

  handlePageClick (e, pageIndex) {
    e.preventDefault()
    this.setState({
      activeChouettePageIndex: pageIndex
    })
  }

  setActiveActionAllFilter (event) {
    if (event.target.name === 'action-filter') {
      const {dispatch} = this.props
      dispatch(SuppliersActions.setActiveActionAllFilter(event.target.value))
    }
  }

  handleSortForColumn(columnName) {
    const {dispatch} = this.props
    dispatch(SuppliersActions.sortListByColumn("chouetteAll", columnName))
  }

  getJobStatus(status) {
    if (status == "TERMINATED") return "COMPLETED"
    return status
  }

  handleOnDatePickerChange(event, date) {
    this.setState({
      filterFromDate: date
    })
  }

  getPaginationMap() {

    let { chouetteAllJobStatus, sortProperty, sortOrder } = this.props

    const { filterFromDate } = this.state

    let filteredStatus = chouetteAllJobStatus.filter( job => {

      if (!filterFromDate) return true

      return (new Date(job.created) > new Date(filterFromDate))

    }).sort( (curr, prev) => {

      if (sortOrder == 0) {
        return (curr[sortProperty] > prev[sortProperty] ? -1 : 1)
      }

      if (sortOrder == 1) {
        return (curr[sortProperty] > prev[sortProperty] ? 1 : -1)
      }
    })

    let paginationMap = []

    for (let i = 0, j = filteredStatus.length; i < j; i+=20) {
      paginationMap.push(filteredStatus.slice(i,i+20))
    }

    return paginationMap
  }

  render() {

    const { chouetteJobAllFilter, requestingJobs} = this.props
    const { activeChouettePageIndex } = this.state
    const paginationMap = this.getPaginationMap()
    const page = paginationMap ? paginationMap[activeChouettePageIndex] : null

    return(

      <div>
        <Container fluid={true}>
          <Panel>
            <div className="filter-wrapper">
              <Row>
                <Col md="1">
                  <p><b>Status</b></p>
                </Col>
                <Col md="2">
                  <Checkbox onChange={(event) => this.handleStatusFilterAllChange(event)} defaultChecked={chouetteJobAllFilter.SCHEDULED} name="SCHEDULED" label="Scheduled" />
                </Col>
                <Col md="2">
                  <Checkbox onChange={(event) => this.handleStatusFilterAllChange(event)} defaultChecked={chouetteJobAllFilter.STARTED} name="STARTED" label="Started" />
                </Col>
                <Col md="2">
                  <Checkbox onChange={(event) => this.handleStatusFilterAllChange(event)} defaultChecked={chouetteJobAllFilter.TERMINATED}  name="TERMINATED" label="Completed" />
                </Col>
                <Col md="2">
                  <Checkbox onChange={(event) => this.handleStatusFilterAllChange(event)} defaultChecked={chouetteJobAllFilter.CANCELED} name="CANCELED" label="Canceled" />
                </Col>
                <Col md="1">
                  <Checkbox onChange={(event) => this.handleStatusFilterAllChange(event)} defaultChecked={chouetteJobAllFilter.ABORTED} name="ABORTED" label="Aborted/Error" />
                </Col>
              </Row>
            </div>
            <div className="filter-wrapper">
              <Row>
                <Col md="1">
                  <p><b>Action</b></p>
                </Col>
                <Form>
                  <Col md="2">
                    <Radio onClick={ (event) => this.setActiveActionAllFilter(event)} value="" name="action-filter" label="No filter" defaultChecked={true} />
                  </Col>
                  <Col md="2">
                    <Radio onClick={ (event) => this.setActiveActionAllFilter(event)} value="importer" name="action-filter" label="Importer" />
                  </Col>
                  <Col md="2">
                    <Radio onClick={ (event) => this.setActiveActionAllFilter(event)}  value="exporter" name="action-filter" label="Exporter" />
                  </Col>
                  <Col md="2">
                    <Radio onClick={ (event) => this.setActiveActionAllFilter(event)}  value="validator" name="action-filter" label="Validator"/>
                  </Col>
                  <Col md="3">
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <MdClear
                        onClick={ () => this.setState({filterFromDate: null})}
                        style={{marginRight: 5}}
                      />
                      <DatePicker
                        hintText="From ..."
                        autoOk
                        onChange={this.handleOnDatePickerChange.bind(this)}
                        style={{display: 'inline-block'}}
                        textFieldStyle={{width: '60%'}}
                        value={this.state.filterFromDate}
                      />
                    </div>
                  </Col>
                </Form>
              </Row>
            </div>
          </Panel>
          <Row>
            <div>
              { (paginationMap.length > 0) ?

                <div className="page-link-parent">
                  <span>Pages: </span>
                  {paginationMap.map ( (page, index) => {
                    const isActive = (index == activeChouettePageIndex) ? 'page-link active-link' : 'page-link inactive-link'
                    return <span className={isActive} onClick={(e) => this.handlePageClick(e, index)} key={"link-" + index}>{index}</span>
                  })}
                </div> :

                <div></div>
              }
            </div>
            { requestingJobs ?
              <div style={{float: 'right', position: 'absolute', right: 40}}><Loader color="#26A65B" size="23px"/></div> : null }
          </Row>
          { (page && page.length) ?

            <Row>
              <Col md="1">
                <div className="table-header" onClick={ () => this.handleSortForColumn("referential") }>Provider</div>
              </Col>
              <Col md="1">
                <div className="table-header" onClick={ () => this.handleSortForColumn("id") }>Id</div>
              </Col>
              <Col md="1">
                <div className="table-header" onClick={ () => this.handleSortForColumn("action") }>Action</div>
              </Col>
              <Col md="2">
                <div className="table-header" onClick={ () => this.handleSortForColumn("created") }>Created</div>
              </Col>
              <Col md="2">
                <div className="table-header" onClick={ () => this.handleSortForColumn("started") }>Started</div>
              </Col>
              <Col md="2">
                <div className="table-header" onClick={ () => this.handleSortForColumn("updated") }>Updated</div>
              </Col>
              <Col md="1">
                <div className="table-header" onClick={ () => this.handleSortForColumn("status") }>Status</div>
              </Col>
            </Row> :

            <Row><p>No chouette jobs found for your search criterias.</p></Row>

          }

        </Container>
        { (page && page.length) ?
          <Container fluid={true}> { page.map( (job, index) => {

              const statusClass = (job.status === 'ABORTED' || job.status === 'CANCELED') ? 'error' : 'success'
              const chouetteURL = `${window.config.chouetteBaseUrl}/referentials/${job.referential}/`

              return <Row key={'ch-job-' + index} style={{display: 'flex', alignItems: 'center'}}>
                <Col md="1">
                  <a title={chouetteURL} target="_blank" href={chouetteURL}>{job.referential}</a>
                </Col>
                <Col md="1">
                  <ChouetteLink id={job.id} referential={job.referential} action={job.action}>{job.id}</ChouetteLink>
                </Col>
                <Col md="1">
                  <p>{job.action}</p>
                </Col>
                <Col md="2">
                  <p>{job.created}</p>
                </Col>
                <Col md="2">
                  <p>{job.started}</p>
                </Col>
                <Col md="2">
                  <p>{job.updated}</p>
                </Col>
                <Col md="1">
                  <p><span className={statusClass}>{this.getJobStatus(job.status)}</span></p>
                </Col>
                { (job.status === 'STARTED' || job.status === 'SCHEDULED') ?
                  <Col md="1">
                    <Button key={"btn-delete-" + index} onClick={ () => this.handleCancelChouetteJob(job.id, job.providerId)} size="small" color="danger">Cancel</Button>
                  </Col> : <div></div>
                }

              </Row>
            }) }
          </Container> : <div></div> }

        </div> )
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
      }
    }

    export default connect(mapStateToProps)(ChouetteAllJobs)
