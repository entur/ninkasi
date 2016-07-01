import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersItem from './SuppliersItem'
import SuppliersActions from '../actions/SuppliersActions'
import { bindActionCreators } from 'redux'

class SuppliersContainer extends React.Component {

  componentDidMount() {
    this.props.store.dispatch(SuppliersActions.fetchSuppliers())
  }

  buildGraph() {
    this.props.store.dispatch(SuppliersActions.buildGraph())
  }

  render() {

    const { store }  = this.props
    const suppliers = this.props.data || []

    return (

      <div>
      <h2>Providers</h2>
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
      <button onClick={this.buildGraph.bind(this)}>Build graph</button>
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
