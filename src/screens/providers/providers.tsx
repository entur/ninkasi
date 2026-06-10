import { Box } from '@mui/material';
import SuppliersContainer from './components/SuppliersContainer';
import SupplierTabWrapper from './components/SupplierTabWrapper';
import SupplierPage from './components/SupplierPage';
import AdministrativeActions from './components/AdministrativeActions';
import { ShowOTPGraphStatus } from './components/ShowOTPGraphStatus';
import { useAppSelector } from '@/store/hooks';

const Providers = () => {
  const isAdmin = useAppSelector(state => state.UserContextReducer.isRouteDataAdmin);
  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {isAdmin && <AdministrativeActions />}
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                margin: '0 20px',
                justifyContent: 'space-between',
              }}
            >
              <SuppliersContainer />
              <ShowOTPGraphStatus />
            </Box>
            <SupplierTabWrapper />
            <SupplierPage />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Providers;
