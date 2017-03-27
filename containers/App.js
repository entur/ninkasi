import React, { Component, PropTypes } from 'react'
import SuppliersContainer from './SuppliersContainer'
import SupplierTabWrapper from './SupplierTabWrapper'
import SupplierPage from './SupplierPage'
import NotificationContainer from './NotificationContainer'
import ModalViewContainer from '../modals/ModalActionContainer'
import cfgreader from '../config/readConfig'
import Header from '../components/Header'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { connect } from 'react-redux'
import UtilsActions from '../actions/UtilsActions'

 class MainPage extends React.Component {

  componentWillMount(){
    cfgreader.readConfig( (function(config) {
      console.info("loaded config", config)
      window.config = config
      this.props.dispatch(UtilsActions.notifyConfigIsLoaded())
    }).bind(this))
  }

  render() {

    if (this.props.isConfigLoaded) {
      return (
        <MuiThemeProvider>
          <div className="app">
            <Header/>
            <SuppliersContainer/>
            <SupplierTabWrapper/>
            <NotificationContainer/>
            <ModalViewContainer/>
            <SupplierPage/>
          </div>
        </MuiThemeProvider>
      )
    } else {
      return null
    }

  }
}

const mapStateToProps = state => ({
  isConfigLoaded: state.UtilsReducer.isConfigLoaded
})


export default connect(mapStateToProps)(MainPage)