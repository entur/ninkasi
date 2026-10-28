import { Navigate, Route, Routes } from 'react-router-dom';

import Providers from 'screens/providers';
import Organization from 'screens/organization';
import ValidationReport from 'screens/netexValidationReports/ValidationReport';
import GraphControlPage from 'screens/graphControl/GraphControlPage';
import { useAppSelector } from '@/store/hooks';

const Router = () => {
  const isRouteDataAdmin = useAppSelector(state => state.UserContextReducer.isRouteDataAdmin);

  if (!isRouteDataAdmin) {
    return (
      <Routes>
        <Route path="/permissions" element={<Organization />} />
        <Route path="*" element={<Navigate to="/permissions" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Providers />} />
      <Route path="/timetable-admin" element={<Providers />} />
      <Route path="/timetable-pipeline" element={<Providers />} />
      <Route path="/permissions" element={<Organization />} />
      <Route path="/graph-control" element={<GraphControlPage />} />
      <Route
        path="/netex-validation-reports/report/:codespace/:id"
        element={<ValidationReport />}
      />
    </Routes>
  );
};

export default Router;
