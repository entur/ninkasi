import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersItem from './SuppliersItem'
import SuppliersActions from '../actions/SuppliersActions'
import { bindActionCreators } from 'redux'
import cfgreader from '../config/readConfig'

class SuppliersContainer extends React.Component {

  componentDidMount() {
    cfgreader.readConfig( (function(config) {
      window.config = config;
      this.props.store.dispatch(SuppliersActions.fetchSuppliers( window.config ))
    }).bind(this))
  }

  buildGraph() {
    this.props.store.dispatch(SuppliersActions.buildGraph())
  }

  fetchOSM() {
    this.props.store.dispatch(SuppliersActions.fetchOSM())
  }

  newProvider() {
    console.log("Create new provider")
  }

  render() {

    const { store }  = this.props
    const suppliers = this.props.data || []

    return (

      <div>
      <h1>Providers</h1>
      <ol>
        {suppliers.map(supplier => {
          return (
              <SuppliersItem
                store={store}
                key={supplier.id}
                id={supplier.id}
                name={supplier.name}>
                {supplier.name}
              </SuppliersItem>
          )
        })}
      </ol>
      <button onClick={this.newProvider}>New Provider</button>
      <button onClick={this.buildGraph.bind(this)}>Build OTP graph</button>
      <button onClick={this.fetchOSM.bind(this)}>Fetch OSM data</button>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    data: state.suppliersReducer.data
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuppliersContainer)
