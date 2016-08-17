import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import cfgreader from '../config/readConfig'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'
import Button from 'muicss/lib/react/button'

import SuppliersActions from '../actions/SuppliersActions'


class ChouetteJobDetails extends React.Component {

  componentWillMount(){
    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  handleDeleteChouetteJob = (index) => {
    const {dispatch, activeId} = this.props
    dispatch(SuppliersActions.deleteChouetteJobForProvider(activeId, index))
  }

  handleDeleteAllChouetteJobs = () => {
    const {dispatch, activeId} = this.props
    dispatch(SuppliersActions.deleteAllChouetteJobsforProvider(activeId))
  }

  render() {

    const {chouetteJobs} = this.props

    return(

      <div>
        <Container fluid={true}>
          <Row>
            <Col md="1">
              <p><b>id</b></p>
            </Col>
            <Col md="1">
              <p><b>referantial</b></p>
            </Col>
            <Col md="1">
              <p><b>action</b></p>
            </Col>
            <Col md="1">
              <p><b>type</b></p>
            </Col>
            <Col md="1">
              <p><b>created</b></p>
            </Col>
            <Col md="1">
              <p><b>started</b></p>
            </Col>
            <Col md="1">
              <p><b>updated</b></p>
            </Col>
            <Col md="1">
              <p><b>status</b></p>
            </Col>
            <Col md="1">
              <Button key={"btn-delete-all"} onClick={this.handleDeleteAllChouetteJobs} size="small" color="danger">Delete all</Button>
            </Col>
          </Row>
        </Container>
        { (chouetteJobs && chouetteJobs.length) ?
          <Container fluid={true}> { chouetteJobs.map( (job, index) => {
            return <Row key={'ch-job-' + index}>
              <Col md="1">
                <p>{job.id}</p>
              </Col>
              <Col md="1">
                <p>{job.referential}</p>
              </Col>
              <Col md="1">
                <p>{job.action}</p>
              </Col>
              <Col md="1">
                <p>{job.type}</p>
              </Col>
              <Col md="1">
                <p>{job.created}</p>
              </Col>
              <Col md="1">
                <p>{job.started}</p>
              </Col>
              <Col md="1">
                <p>{job.updated}</p>
              </Col>
              <Col md="1">
                <p>{job.status}</p>
              </Col>
              <Col md="1">
                <Button key={"btn-delete-" + index} onClick={ () => this.handleDeleteChouetteJob(job.id)} size="small" color="danger">X</Button>
              </Col>
            </Row>
          }) }
        </Container> : <div></div> }

      </div> )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    chouetteJobs: state.MardukReducer.chouetteJobStatus,
    activeId: state.SuppliersReducer.activeId,
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
