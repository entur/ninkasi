import React, { PropTypes } from 'react'
import SuppliersActions from '../actions/SuppliersActions'
import { connect } from 'react-redux'
import classNames from 'classnames'

require('../sass/components/lists.scss')

class SupplierItem extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { name, id } = this.props

    return (
      <option value={id}>
        {id} {name}
      </option>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeId: state.SuppliersReducer.activeId
  }
}

export default connect(
  mapStateToProps,
  null
)(SupplierItem)
