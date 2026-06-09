import { Route, Routes } from 'react-router-dom';

import Providers from 'screens/providers';
import Organization from 'screens/organization';
import ValidationReport from 'screens/netexValidationReports/ValidationReport';

const Router = () => (
  <Routes>
    <Route path="/" element={<Providers />} />
    <Route path="/timetable-admin" element={<Providers />} />
    <Route path="/timetable-pipeline" element={<Providers />} />
    <Route path="/permissions" element={<Organization />} />
    <Route path="/netex-validation-reports/report/:codespace/:id" element={<ValidationReport />} />
  </Routes>
);

export default Router;
