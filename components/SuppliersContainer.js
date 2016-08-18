import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import { bindActionCreators } from 'redux'
import cfgreader from '../config/readConfig'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Button from 'muicss/lib/react/button'
import Option from 'muicss/lib/react/option'
import Select from 'muicss/lib/react/select'
import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'

const FaAdd = require('react-icons/lib/fa/plus-circle')
const FaHistory = require('react-icons/lib/fa/history')

class SuppliersContainer extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {

   const {dispatch} = this.props

    cfgreader.readConfig( (function(config) {
      window.config = config
      dispatch(SuppliersActions.fetchSuppliers())
    }).bind(this))
  }

  handleBuildGraph() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.buildGraph())
  }

  handleFetchOSM() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.fetchOSM())
  }

  openModal() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.openModalDialog())
  }

  selectSupplier(value) {
    const {dispatch} = this.props
    dispatch(SuppliersActions.selectActiveSupplier(value))
  }

  render() {

    const {suppliers} = this.props

    return (

      <Container fluid={true}>
      <Row>
        <Col md="7">
          <Select id="select-supplier" label="Provider" onChange={ (value) => this.selectSupplier(value)}>
            <Option value="-1" label="Select provider"></Option>
            {suppliers.map(supplier => {
              return (
                  <Option key={supplier.id} value={supplier.id} label={supplier.id + " " + supplier.name}>
                  </Option>
              )
            })}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col md="10">
          <Button id="new-provider" onClick={() => browserHistory.push('/admin/ninkasi/provider/new/')}><FaAdd/>  New provider</Button>
          <Button color="primary" onClick={this.handleBuildGraph.bind(this)}>Build OTP graph</Button>
          <Button color="primary" onClick={this.handleFetchOSM.bind(this)}>Fetch OSM data</Button>
          <Button color="primary" onClick={() => this.openModal()}><FaHistory/> History</Button>
        </Col>
      </Row>
    </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    suppliers: state.SuppliersReducer.data
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuppliersContainer)
