import React from 'react';
import { Route, Switch } from 'react-router';

import Providers from 'screens/providers';
import Geocoder from 'screens/geocoder';
import { MicroFrontend } from '@entur/micro-frontend';
import { useAuth } from '@entur/auth-provider';
import { connect } from 'react-redux';
import SuppliersActions from 'actions/SuppliersActions';
import { MicroFrontendFetchStatus } from './components/MicroFrontendFetchStatus';

const notifyNetexValidationReportLoadingFailure = dispatch => () => {
  dispatch(
    SuppliersActions.addNotification(
      'Error loading micro frontend for NeTEx validation reports',
      'error'
    )
  );
};

const Router = ({ dispatch }) => {
  const auth = useAuth();
  return (
    <Switch>
      <Route exact path="/" component={Providers} />
      <Route exact path="/geocoder" component={Geocoder} />
      <Route path="/netex-validation-reports">
        {window.config.udugMicroFrontendUrl && (
          <div style={{ backgroundColor: '#fff' }}>
            <MicroFrontend
              id="ror-udug"
              host={window.config.udugMicroFrontendUrl}
              path="/netex-validation-reports"
              staticPath=""
              name="NeTEx validation reports"
              payload={{
                getToken: auth.getAccessToken
              }}
              FetchStatus={props => (
                <MicroFrontendFetchStatus
                  {...props}
                  label="Error loading NeTEx validation reports"
                />
              )}
              handleError={notifyNetexValidationReportLoadingFailure(dispatch)}
            />
          </div>
        )}
      </Route>
    </Switch>
  );
};

export default connect()(Router);
