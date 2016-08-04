import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersItem from './SuppliersItem'
import SuppliersActions from '../actions/SuppliersActions'
import { bindActionCreators } from 'redux'
import cfgreader from '../config/readConfig'

class SuppliersContainer extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    const {dispatch} = this.props

    cfgreader.readConfig( (function(config) {
      window.config = config
      dispatch(SuppliersActions.fetchSuppliers( window.config ))
    }).bind(this))
  }

  buildGraph() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.buildGraph())
  }

  fetchOSM() {
    const {dispatch} = this.props
    dispatch(SuppliersActions.fetchOSM())
  }

  newProvider() {
    // TODO : implement this
    console.log("Create new provider")
  }

  selectSupplier(event) {
    const {dispatch} = this.props

    dispatch(SuppliersActions.selectActiveSupplier(event.target.value))
    dispatch(SuppliersActions.fetchFilenames(event.target.value))

    // TODO : refactor this - this is a redux anti-pattern
    let outboundFilelist = document.querySelector("#outboundFilelist")
    let selected = []

    for (let i = 0; i < outboundFilelist.children.length; i++) { selected.push(i) }

    let i = selected.length

    while (i--)
      if (outboundFilelist[i]) outboundFilelist.remove(i)

  }

  render() {

    const { store }  = this.props
    const suppliers = this.props.data || []

    return (

      <div>
      <h1>Providers</h1>
      <select onChange={this.selectSupplier.bind(this)}>
        <option selected="selected">Select a provider</option>
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
      <button onClick={this.newProvider.bind(this)}>+ New Provider</button>
      <div className="action-panel">
        <button onClick={this.buildGraph.bind(this)}>Build OTP graph</button>
        <button onClick={this.fetchOSM.bind(this)}>Fetch OSM data</button>
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
