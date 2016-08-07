import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersItem from './SuppliersItem'
import SuppliersActions from '../actions/SuppliersActions'
import { bindActionCreators } from 'redux'
import cfgreader from '../config/readConfig'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'


class SuppliersContainer extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    const {dispatch} = this.props

    cfgreader.readConfig( (function(config) {
      window.config = config
      dispatch(SuppliersActions.fetchSuppliers( window.config ))
      dispatch(SuppliersActions.selectActiveSupplier( 0 ))

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

  handleSomething() {
    // Todo : implement this
    const {dispatch} = this.props
  }

  selectSupplier(event) {
    const {dispatch} = this.props

    dispatch(SuppliersActions.selectActiveSupplier(event.target.value))
    dispatch(SuppliersActions.fetchFilenames(event.target.value))

    // TODO : This should be refactored to use store.dispatch instead

    let outboundFilelist = document.querySelector("#outboundFilelist")

    if (outboundFilelist && outboundFilelist.length) {

      let selected = []

      for (let i = 0; i < outboundFilelist.children.length; i++) { selected.push(i) }

      let i = selected.length

      while (i--)
        if (outboundFilelist[i]) outboundFilelist.remove(i)

    }

  }

  render() {

    const { store }  = this.props
    const suppliers = this.props.data || []

    return (

      <div>
      <h1>Providers</h1>
      <select onChange={this.selectSupplier.bind(this)}>
        <option selected="selected"></option>
        {suppliers.map(supplier => {
          return (
              <SuppliersItem
                key={supplier.id}
                id={supplier.id}
                name={supplier.name}>
                {supplier.name}
              </SuppliersItem>
          )
        })}
      </select>
      <button onClick={() => browserHistory.push('/ninkasi/provider/new/')}>+ New provider</button>
      <div className="action-panel">
        <button onClick={this.handleBuildGraph.bind(this)}>Build OTP graph</button>
        <button onClick={this.handleFetchOSM.bind(this)}>Fetch OSM data</button>
        <button onClick={this.handleSomething.bind(this)}>Do something</button>
      </div>
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
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuppliersContainer)
