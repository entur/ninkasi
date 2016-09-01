import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import SuppliersContainer from '../components/SuppliersContainer'
import SupplierTabWrapper from '../components/SupplierTabWrapper'
import NotificationContainer from '../components/NotificationContainer'
import Footer from '../components/Footer'

import cfgreader from '../config/readConfig'

import ModalViewContainer from '../components/ModalActionContainer'


export default class MainPage extends React.Component {

  render() {

    return (
      <div className="app">
        <SuppliersContainer/>
        <SupplierTabWrapper/>
        <NotificationContainer/>
        <ModalViewContainer/>
        <Footer/>
      </div>
    )
  }
}
