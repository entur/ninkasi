import SuppliersContainer from './components/SuppliersContainer';
import SupplierTabWrapper from './components/SupplierTabWrapper';
import SupplierPage from './components/SupplierPage';
import AdministrativeActions from './components/AdministrativeActions';
import { ShowOTPGraphStatus } from './components/ShowOTPGraphStatus';
import { useAppSelector } from '@/store/hooks';

const Providers = () => {
  const isAdmin = useAppSelector(state => state.UserContextReducer.isRouteDataAdmin);
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {isAdmin && <AdministrativeActions />}
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                margin: '0 20px',
                justifyContent: 'space-between',
              }}
            >
              <SuppliersContainer />
              <ShowOTPGraphStatus />
            </div>
            <SupplierTabWrapper />
            <SupplierPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Providers;
