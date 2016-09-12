import React, { Component, PropTypes } from 'react'
import SuppliersContainer from './SuppliersContainer'
import SupplierTabWrapper from './SupplierTabWrapper'
import SupplierPage from './SupplierPage'
import NotificationContainer from './NotificationContainer'
import Footer from '../components/Footer'
import ModalViewContainer from './ModalActionContainer'

export default class MainPage extends React.Component {

  render() {

    return (
      <div className="app">
        <SuppliersContainer/>
        <SupplierTabWrapper/>
        <NotificationContainer/>
        <ModalViewContainer/>
        <SupplierPage/>
        <Footer/>
      </div>
    )
  }
}
