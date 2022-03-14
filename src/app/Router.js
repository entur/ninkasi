import React from 'react';
import { Route, Switch } from 'react-router';

import Providers from 'screens/providers';
import Geocoder from 'screens/geocoder';
import { MicroFrontend } from '@entur/micro-frontend';
import { useAuth } from '@entur/auth-provider';
import StatusLabel from 'screens/providers/components/StatusLabel';
import { connect } from 'react-redux';
import SuppliersActions from 'actions/SuppliersActions';

const FetchStatus = props => {
  if (props.status !== 'SUCCESS' && props.status !== 'LOADING') {
    return (
      <StatusLabel
        type="ERROR"
        label="Error loading NeTEx validation reports"
      />
    );
  } else {
    return null;
  }
};

const handleMicroFrontendError = dispatch => () => {
  dispatch(
    SuppliersActions.addNotification('Error loading micro-frontend', 'error')
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
          <MicroFrontend
            id="ror-udug"
            host={window.config.udugMicroFrontendUrl}
            path="/netex-validation-reports"
            staticPath=""
            name="NeTEx validation reports"
            payload={{
              getToken: auth.getAccessToken
            }}
            FetchStatus={FetchStatus}
            handleError={handleMicroFrontendError(dispatch)}
          />
        )}
      </Route>
    </Switch>
  );
};

export default connect()(Router);
