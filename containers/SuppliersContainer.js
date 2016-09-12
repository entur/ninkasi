import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import { bindActionCreators } from 'redux'
import cfgreader from '../config/readConfig'
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

    if (value > 0) {
      dispatch(SuppliersActions.selectActiveSupplier(value))
    } else {
      dispatch(SuppliersActions.selectAllSuppliers())
    }

  }

  handleNewProvider() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.openNewProviderDialog())
  }

  render() {

    const {suppliers, activeProviderId} = this.props

    let selectedValue = (typeof(activeProviderId) !== 'undefined') ? String(activeProviderId) : "0"

    return (

      <Container className="suppliers-container">
        <h1>Ninkasi</h1>
        <Row>
          <Col md="15">
            <div style={ {float: "right"}}>
                <div className="subtle-button mui-btn mui-btn--raised" onClick={this.handleBuildGraph.bind(this)}>Build Graph</div>
                <div className="subtle-button mui-btn mui-btn--raised" onClick={this.handleFetchOSM.bind(this)}>Fetch OSM</div>
                <div className="subtle-button mui-btn mui-btn--raised" onClick={() => this.openModal()}><FaHistory/> History</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="5">
            <Select className="select-supplier" value={ selectedValue } id="select-supplier" label="Provider" onChange={ (value) => this.selectSupplier(value)}>
              <Option key="supplier-all" value="-1" label={"All providers"}></Option>
              {suppliers.map(supplier => {
                return (
                    <Option key={supplier.id} value={String(supplier.id)} label={`${supplier.id} ${supplier.name}`}>
                    </Option>
                )
              })}
            </Select>
          </Col>
          <Col md="2">
            <div className="new-provider" onClick={() => this.handleNewProvider()}><FaAdd/> New</div>
          </Col>
      </Row>
    </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    suppliers: state.SuppliersReducer.data,
    activeProviderId: state.SuppliersReducer.activeId
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
