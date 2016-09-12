import React, { Component, PropTypes } from 'react'
import SuppliersContainer from './SuppliersContainer'
import SupplierTabWrapper from './SupplierTabWrapper'
import SupplierPage from './SupplierPage'
import NotificationContainer from './NotificationContainer'
import Footer from '../components/Footer'
import ModalViewContainer from './ModalActionContainer'
import cfgreader from '../config/readConfig'

export default class MainPage extends React.Component {

  componentWillMount(){
    cfgreader.readConfig( (function(config) {
      console.info("loaded config", config)
      window.config = config
    }).bind(this))
  }

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
