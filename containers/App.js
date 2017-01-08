import React, { Component, PropTypes } from 'react'
import SuppliersContainer from './SuppliersContainer'
import SupplierTabWrapper from './SupplierTabWrapper'
import SupplierPage from './SupplierPage'
import NotificationContainer from './NotificationContainer'
import ModalViewContainer from './ModalActionContainer'
import cfgreader from '../config/readConfig'
import Header from '../components/Header'

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
        <Header/>
        <SuppliersContainer/>
        <SupplierTabWrapper/>
        <NotificationContainer/>
        <ModalViewContainer/>
        <SupplierPage/>
      </div>
    )
  }
}
