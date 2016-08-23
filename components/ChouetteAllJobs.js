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
import Panel from 'muicss/lib/react/panel'


import SuppliersActions from '../actions/SuppliersActions'


class ChouetteAllJobs extends React.Component {

  componentWillMount(){
    const {dispatch} = this.props
    cfgreader.readConfig( (function(config) {
      window.config = config
      dispatch(SuppliersActions.getChouetteJobsForAllSuppliers())
    }).bind(this))
  }

  handleCancelChouetteJob = (id, providerId) => {
    const {dispatch} = this.props
    dispatch(SuppliersActions.cancelChouetteJobForProvider(providerId, id))
  }

  handleStatusFilterAllChange = (event) => {
    const {dispatch} = this.props
    dispatch(SuppliersActions.toggleChouetteInfoCheckboxAllFilter(event.target.name, event.target.checked))
  }

  handlePageClick (e, pageIndex) {
    e.preventDefault()
    const {dispatch} = this.props
    dispatch(SuppliersActions.setActiveChouettePageIndex(pageIndex))
  }

  setActiveActionAllFilter (event) {
    if (event.target.name === 'action-filter') {
      const {dispatch} = this.props
      dispatch(SuppliersActions.setActiveActionAllFilter(event.target.value))
    }
  }

  render() {

    const {page, chouetteJobAllFilter, paginationMap, activeChouettePageIndex} = this.props

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
                  <Checkbox onChange={(event) => this.handleStatusFilterAllChange(event)} defaultChecked={chouetteJobAllFilter.TERMINATED}  name="TERMINATED" label="Terminated" />
                </Col>
                <Col md="2">
                  <Checkbox onChange={(event) => this.handleStatusFilterAllChange(event)} defaultChecked={chouetteJobAllFilter.CANCELED} name="CANCELED" label="Canceled" />
                </Col>
                <Col md="1">
                  <Checkbox onChange={(event) => this.handleStatusFilterAllChange(event)} defaultChecked={chouetteJobAllFilter.ABORTED} name="ABORTED" label="Aborted" />
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
                </Form>
              </Row>
            </div>
          </Panel>
          <Row>
            <Col md="12">
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
            </Col>
          </Row>
          { (page && page.length) ?

            <Row>
              <Col md="1">
                <p><b>Provider</b></p>
              </Col>
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
            </Row> :

            <Row><p>No chouette jobs found for your search criterias.</p></Row>

          }

        </Container>
        { (page && page.length) ?
          <Container fluid={true}> { page.map( (job, index) => {

              const statusClass = (job.status === 'ABORTED' || job.status === 'CANCELED') ? 'error' : 'success'

              return <Row key={'ch-job-' + index}>
                <Col md="1">
                  <p>{job.referential}</p>
                </Col>
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

    const mapStateToProps = (state, ownProps) => {

      var paginationMap = []
      var list = state.MardukReducer.chouetteAllJobStatus

      for (let i = 0, j = list.length; i < j; i+=20) {
        paginationMap.push(list.slice(i,i+20))
      }

      return {
        page: paginationMap[state.UtilsReducer.activeChouettePageIndex],
        chouetteJobAllFilter: state.MardukReducer.chouetteJobAllFilter,
        paginationMap: paginationMap,
        activeChouettePageIndex: state.UtilsReducer.activeChouettePageIndex,
        actionAllFilter: state.MardukReducer.actionAllFilter
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
    )(ChouetteAllJobs)
