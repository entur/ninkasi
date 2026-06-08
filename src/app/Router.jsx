import React from 'react';
import { Route, Switch } from 'react-router';

import Providers from 'screens/providers';
import Organization from 'screens/organization';
import ValidationReport from 'screens/netexValidationReports/ValidationReport';

const Router = () => (
  <Switch>
    <Route exact path="/" component={Providers} />
    <Route exact path="/timetable-admin" component={Providers} />
    <Route exact path="/timetable-pipeline" component={Providers} />
    <Route exact path="/permissions" component={Organization} />
    <Route path="/netex-validation-reports/report/:codespace/:id" component={ValidationReport} />
  </Switch>
);

export default Router;
