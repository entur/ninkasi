import React from 'react';
import { Route, Switch } from 'react-router';

import Providers from 'screens/providers';
import Geocoder from 'screens/geocoder';

export default () => {
  return (
    <Switch>
      <Route exact path="/" component={Providers} />
      <Route exact path="/geocoder" component={Geocoder} />
    </Switch>
  );
};
