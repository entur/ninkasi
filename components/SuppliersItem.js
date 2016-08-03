import React, { PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import { connect } from 'react-redux'
import classNames from 'classnames'

require('../sass/components/lists.scss')

class SupplierItem extends React.Component {

  constructor(props) {
    super(props)
  }

  selectSupplier(data) {
    const {dispatch} = this.props
    dispatch(SuppliersActions.selectActiveSupplier(data.id))
    dispatch(SuppliersActions.fetchFilenames(data.id))
  }

  render() {

    const { name, id, activeId } = this.props

    const liClass = classNames({
      'active' : (id === activeId)
    })

    return (
      <li className={liClass} onClick={() => this.selectSupplier({id})}>
        {id} {name}
      </li>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  return {
    activeId: state.suppliersReducer.activeId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(SupplierItem)
