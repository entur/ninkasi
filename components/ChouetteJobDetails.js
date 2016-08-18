import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'
import Button from 'muicss/lib/react/button'
import Checkbox from 'muicss/lib/react/checkbox'
import Radio from 'muicss/lib/react/radio'
import Form from 'muicss/lib/react/form'


import SuppliersActions from '../actions/SuppliersActions'


class ChouetteJobDetails extends React.Component {

  componentWillMount(){
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  handleCancelChouetteJob = (index) => {
    const {dispatch, activeId} = this.props
    dispatch(SuppliersActions.cancelChouetteJobForProvider(activeId, index))
  }

  handleCancelAllChouetteJobs = () => {
    const {dispatch, activeId} = this.props
    dispatch(SuppliersActions.cancelAllChouetteJobsforProvider(activeId))
  }

  handleStatusFilterChange = (event) => {
    const {dispatch} = this.props
    dispatch(SuppliersActions.toggleChouetteInfoCheckboxFilter(event.target.name, event.target.checked))
  }


  handlePageClick (e, pageIndex) {
    e.preventDefault()
    const {dispatch} = this.props
    dispatch(SuppliersActions.setActiveChouettePageIndex(pageIndex))
  }

  setActiveActionFilter (event) {
      if (event.target.name === 'action-filter') {
        const {dispatch} = this.props
        dispatch(SuppliersActions.setActiveActionFilter(event.target.value))
      }
  }

  render() {

    const {page, chouetteJobFilter, paginationMap, activeChouettePageIndex} = this.props

    return(

      <div>
        <Container fluid={true}>
          <Row>
            <Col md="1">
              <p><b>Status</b></p>
            </Col>
            <Col md="1">
              <Checkbox onChange={(event) => this.handleStatusFilterChange(event)} defaultChecked={chouetteJobFilter.SCHEDULED} name="SCHEDULED" label="Scheduled" />
            </Col>
            <Col md="1">
              <Checkbox onChange={(event) => this.handleStatusFilterChange(event)} defaultChecked={chouetteJobFilter.STARTED} name="STARTED" label="Started" />
            </Col>
            <Col md="1">
              <Checkbox onChange={(event) => this.handleStatusFilterChange(event)} defaultChecked={chouetteJobFilter.TERMINATED}  name="TERMINATED" label="Terminated" />
            </Col>
            <Col md="1">
              <Checkbox onChange={(event) => this.handleStatusFilterChange(event)} defaultChecked={chouetteJobFilter.CANCELED} name="CANCELED" label="Canceled" />
            </Col>
            <Col md="1">
              <Checkbox onChange={(event) => this.handleStatusFilterChange(event)} defaultChecked={chouetteJobFilter.ABORTED} name="ABORTED" label="Aborted" />
            </Col>
          </Row>
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
            </Form>
          </Row>
          <Row>
          <Col md="8">
            <div className="page-link-parent">
              <span>Pages: </span>
              {paginationMap.map ( (page, index) => {
                const isActive = (index == activeChouettePageIndex) ? 'page-link active-link' : 'page-link inactive-link'
                return <span className={isActive} onClick={(e) => this.handlePageClick(e, index)} key={"link-" + index}>{index}</span>
              })}
            </div>
          </Col>
          <Col md="2">
            <Button key={"btn-delete-all"} onClick={this.handleCancelAllChouetteJobs} size="small" color="danger">Cancel all</Button>
          </Col>
          </Row>
          <Row>
            <Col md="1">
              <p><b>Id</b></p>
            </Col>
            <Col md="1">
              <p><b>Action</b></p>
            </Col>
            <Col md="2">
              <p><b>Created</b></p>
            </Col>
            <Col md="2">
              <p><b>Started</b></p>
            </Col>
            <Col md="2">
              <p><b>Updated</b></p>
            </Col>
            <Col md="1">
              <p><b>Status</b></p>
            </Col>
          </Row>
        </Container>
        { (page && page.length) ?
          <Container fluid={true}> { page.map( (job, index) => {

            const statusClass = (job.status === 'ABORTED' || job.status === 'CANCELED') ? 'error' : 'success'

            return <Row key={'ch-job-' + index}>
              <Col md="1">
                <p>{job.id}</p>
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
                <p><span className={statusClass}>{job.status}</span></p>
              </Col>
              <Col md="1">
                <Button key={"btn-delete-" + index} onClick={ () => this.handleCancelChouetteJob(job.id)} size="small" color="danger">Cancel</Button>
              </Col>
            </Row>
          }) }
        </Container> : <div></div> }

      </div> )
    }
}

const mapStateToProps = (state, ownProps) => {

  var paginationMap = []
  var list = state.MardukReducer.chouetteJobStatus

  for (let i = 0, j = list.length; i < j; i+=10) {
    paginationMap.push(list.slice(i,i+10))
  }

  return {
    page: paginationMap[state.UtilsReducer.activeChouettePageIndex],
    activeId: state.SuppliersReducer.activeId,
    chouetteJobFilter: state.MardukReducer.chouetteJobFilter,
    paginationMap: paginationMap,
    activeChouettePageIndex: state.UtilsReducer.activeChouettePageIndex,
    actionFilter: state.MardukReducer.actionFilter
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
