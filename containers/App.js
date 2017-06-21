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
import roleParser from '../roles/rolesParser'
import NoAccess from '../components/NoAccess'

 class MainPage extends React.Component {

  componentWillMount(){
    cfgreader.readConfig( (function(config) {
      console.info("loaded config", config)
      window.config = config
      this.props.dispatch(UtilsActions.notifyConfigIsLoaded())
    }).bind(this))
  }

  render() {

    const { isConfigLoaded, kc } = this.props;

    if (isConfigLoaded) {
      return (
        <MuiThemeProvider>
          <div className="app">
            <div className="version">v{process.env.VERSION}</div>
            <Header/>
            { roleParser.isAdmin(kc.tokenParsed) ?
              <div>
                <SuppliersContainer/>
                <SupplierTabWrapper/>
                <NotificationContainer/>
                <ModalViewContainer/>
                <SupplierPage/>
              </div>
              : <NoAccess
                  username={kc.tokenParsed.preferred_username}
                  handleLogout={() => { kc.logout()}}
              />
            }
          </div>
        </MuiThemeProvider>
      )
    } else {
      return null
    }

  }
}

const mapStateToProps = state => ({
  kc: state.UserReducer.kc,
  isConfigLoaded: state.UtilsReducer.isConfigLoaded
})


export default connect(mapStateToProps)(MainPage)