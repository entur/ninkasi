/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React from 'react';
import cfgreader from '../config/readConfig';
import Header from './components/Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from 'react-redux';
import UtilsActions from '../actions/UtilsActions';
import roleParser from '../roles/rolesParser';
import NoAccess from './components/NoAccess';
import Router from './Router';

class MainPage extends React.Component {
  componentWillMount() {
    cfgreader.readConfig(
      function(config) {
        window.config = config;
        this.props.dispatch(UtilsActions.notifyConfigIsLoaded());
      }.bind(this)
    );
  }

  render() {
    const { isConfigLoaded, kc } = this.props;

    if (isConfigLoaded) {
      return (
        <MuiThemeProvider>
          <div className="app">
            <Header />
            {roleParser.isAdmin(kc.tokenParsed) ? (
              <Router />
            ) : (
              <NoAccess
                username={kc.tokenParsed.preferred_username}
                handleLogout={() => {
                  kc.logout();
                }}
              />
            )}
          </div>
        </MuiThemeProvider>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  kc: state.UserReducer.kc,
  isConfigLoaded: state.UtilsReducer.isConfigLoaded
});

export default connect(mapStateToProps)(MainPage);
