import React from 'react';
import { Route, Switch } from 'react-router';

import Providers from 'screens/providers';
import Geocoder from 'screens/geocoder';
import { MicroFrontend } from '@entur/micro-frontend';
import { useAuth } from '@entur/auth-provider';

const FetchStatus = props => {
  if (props.status !== 'SUCCESS' && props.status !== 'LOADING') {
    return <pre>{JSON.stringify(props)}</pre>;
  } else {
    return null;
  }
};

export default () => {
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
            handleError={e => console.log(e)}
          />
        )}
      </Route>
    </Switch>
  );
};
