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
import SuppliersActions from '../actions/SuppliersActions'
import Loader from 'halogen/DotLoader'

class ChouetteJobDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeChouettePageIndex: 0
    }
  }

  componentWillMount(){
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  handleCancelChouetteJob = (index) => {
    const {dispatch, activeId} = this.props
    dispatch(SuppliersActions.cancelChouetteJobForProvider(activeId, index))
  }

  handleCancelAllChouetteJobs = (event) => {
    event.preventDefault()
    const {dispatch, activeId} = this.props
    dispatch(SuppliersActions.cancelAllChouetteJobsforProvider(activeId))
  }

  handleStatusFilterChange = (event) => {
    const {dispatch} = this.props
    dispatch(SuppliersActions.toggleChouetteInfoCheckboxFilter(event.target.name, event.target.checked))
  }

  handlePageClick (e, pageIndex) {
    e.preventDefault()
    this.setState({
      activeChouettePageIndex: pageIndex
    })
  }

  setActiveActionFilter (event) {
      if (event.target.name === 'action-filter') {
        const {dispatch} = this.props
        dispatch(SuppliersActions.setActiveActionFilter(event.target.value))
      }
  }

  handleSortForColumn(columnName) {
    const {dispatch} = this.props
    dispatch(SuppliersActions.sortListByColumn("chouette", columnName))
  }

  render() {

    const {chouetteJobFilter, paginationMap, requestingJobs} = this.props
    const { activeChouettePageIndex } = this.state
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
                  <Checkbox onChange={(event) => this.handleStatusFilterChange(event)} defaultChecked={chouetteJobFilter.SCHEDULED} name="SCHEDULED" label="Scheduled" />
                </Col>
                <Col md="2">
                  <Checkbox onChange={(event) => this.handleStatusFilterChange(event)} defaultChecked={chouetteJobFilter.STARTED} name="STARTED" label="Started" />
                </Col>
                <Col md="2">
                  <Checkbox onChange={(event) => this.handleStatusFilterChange(event)} defaultChecked={chouetteJobFilter.TERMINATED}  name="TERMINATED" label="Terminated" />
                </Col>
                <Col md="2">
                  <Checkbox onChange={(event) => this.handleStatusFilterChange(event)} defaultChecked={chouetteJobFilter.CANCELED} name="CANCELED" label="Canceled" />
                </Col>
                <Col md="1">
                  <Checkbox onChange={(event) => this.handleStatusFilterChange(event)} defaultChecked={chouetteJobFilter.ABORTED} name="ABORTED" label="Aborted" />
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
                  <Radio onClick={ (event) => this.setActiveActionFilter(event)} value="" name="action-filter" label="No filter" defaultChecked={true} />
                </Col>
                <Col md="2">
                  <Radio onClick={ (event) => this.setActiveActionFilter(event)} value="importer" name="action-filter" label="Importer" />
                </Col>
                <Col md="2">
                  <Radio onClick={ (event) => this.setActiveActionFilter(event)}  value="exporter" name="action-filter" label="Exporter" />
                </Col>
                <Col md="2">
                  <Radio onClick={ (event) => this.setActiveActionFilter(event)}  value="validator" name="action-filter" label="Validator"/>
                </Col>
                <Col md="2">
                  <Button key={"btn-delete-all"} onClick={this.handleCancelAllChouetteJobs} size="small" color="danger">Cancel all</Button>
                </Col>
                </Form>
              </Row>
            </div>
          </Panel>
          <Row>
          <Col md="10">

            { (paginationMap.length > 0) ?

              <div className="page-link-parent lm-17">
                <span>Pages: </span>
                {paginationMap.map ( (page, index) => {
                  const isActive = (index == activeChouettePageIndex) ? 'page-link active-link' : 'page-link inactive-link'
                  return <span className={isActive} onClick={(e) => this.handlePageClick(e, index)} key={"link-" + index}>{index}</span>
                })}
              </div> :

              <div></div>
            }
          </Col>
            { requestingJobs ?
              <div style={{float: 'right', position: 'absolute', right: 40}}><Loader color="#26A65B" size="23px"/></div> : null }
          </Row>
          { (page && page.length) ?

            <Row>
              <Col md="1">
                <div className="table-header" onClick={ () => this.handleSortForColumn("id") }>Id</div>
              </Col>
              <Col md="2">
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

            return <Row key={'ch-job-' + index}>
              <Col md="1">
                <p>{job.id}</p>
              </Col>
              <Col md="2">
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
                <p><span className={statusClass}>{job.status}</span></p>
              </Col>
              { (job.status === 'STARTED' || job.status === 'SCHEDULED') ?
                <Col md="1">
                  <Button key={"btn-delete-" + index} onClick={ () => this.handleCancelChouetteJob(job.id)} size="small" color="danger">Cancel</Button>
                </Col> : <div></div>
              }

            </Row>
          }) }
        </Container> : <div></div> }

      </div> )
    }
}

const mapStateToProps = (state, ownProps) => {

  let list = state.MardukReducer.chouetteJobStatus

  let sortProperty = state.UtilsReducer.chouetteListSortOrder.property
  let sortOrder = state.UtilsReducer.chouetteListSortOrder.sortOrder

  list.sort( (curr, prev) => {

    if (sortOrder == 0) {
      return (curr[sortProperty] > prev[sortProperty] ? -1 : 1)
    }

    if (sortOrder == 1) {
      return (curr[sortProperty] > prev[sortProperty] ? 1 : -1)
    }

  })

  let paginationMap = []

  for (let i = 0, j = list.length; i < j; i+=20) {
    paginationMap.push(list.slice(i,i+20))
  }

  return {
    activeId: state.SuppliersReducer.activeId,
    chouetteJobFilter: state.MardukReducer.chouetteJobFilter,
    paginationMap: paginationMap,
    actionFilter: state.MardukReducer.actionFilter,
    requestingJobs: state.MardukReducer.requesting_chouette_job
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch,
    props: ownProps
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChouetteJobDetails)
