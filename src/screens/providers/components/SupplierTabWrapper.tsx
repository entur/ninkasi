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

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import ChouetteJobDetails from './ChouetteJobDetails';
import ChouetteAllJobs from './ChouetteAllJobs';
import DataMigrationDetails from './DataMigrationDetails';
import { Tabs, Tab, Box } from '@mui/material';
import LoadingState from '@/app/components/LoadingState';
import { getQueryVariable } from '@/utils';
import ExportedFilesView from './ExportedFilesView';
import { EventsView } from './events';
import LineStatisticsView from './lineStatistics/LineStatisticsView';
import * as SuppliersReducer from 'reducers/SuppliersReducer';
import * as MardukReducer from 'reducers/MardukReducer';
const { fetchProviderStatus, fetchAllProviderStatus, fetchExportedFiles } = SuppliersReducer as any;
const { getChouetteJobStatus, getChouetteJobsForAllSuppliers } = MardukReducer as any;

const getTabIndexForValue = (value: string | null, isAllProviders: boolean): number => {
  if (isAllProviders) {
    switch (value) {
      case 'chouetteJobs':
        return 0;
      case 'events':
        return 1;
      case 'statistics':
        return 2;
      case 'exportedFiles':
        return 3;
      default:
        return 0;
    }
  } else {
    switch (value) {
      case 'migrateData':
        return 0;
      case 'events':
        return 1;
      case 'chouetteJobs':
        return 2;
      case 'statistics':
        return 3;
      default:
        return 0;
    }
  }
};

const getTabValueFromIndex = (index: number, isAllProviders: boolean): string => {
  if (isAllProviders) {
    const values = ['chouetteJobs', 'events', 'statistics', 'exportedFiles'];
    return values[index] || 'chouetteJobs';
  } else {
    const values = ['migrateData', 'events', 'chouetteJobs', 'statistics'];
    return values[index] || 'migrateData';
  }
};

const SupplierTabWrapper = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  const suppliers = useAppSelector(state => state.SuppliersReducer.data);
  const activeId = useAppSelector(state => state.SuppliersReducer.activeId);
  const fileListIsLoading = useAppSelector(state => state.MardukReducer.filenames.isLoading);
  const displayAllSuppliers = useAppSelector(
    state => state.SuppliersReducer.all_suppliers_selected
  );
  const suppliersIsLoading = useAppSelector(state => state.SuppliersReducer.isLoading);

  const [activeTabForProvider, setActiveTabForProvider] = useState<string>(
    getQueryVariable('tab') || 'events'
  );
  const [activeTabForAllProvider, setActiveTabForAllProvider] = useState<string>(
    getQueryVariable('tab') || 'events'
  );
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  // Ref-tracking for poll/tab logic so the interval callback always sees the latest
  // values without resetting the interval on every state update.
  const activeTabForProviderRef = useRef(activeTabForProvider);
  const activeTabForAllProviderRef = useRef(activeTabForAllProvider);
  const activeIdRef = useRef(activeId);
  const displayAllSuppliersRef = useRef(displayAllSuppliers);

  useEffect(() => {
    activeTabForProviderRef.current = activeTabForProvider;
  }, [activeTabForProvider]);
  useEffect(() => {
    activeTabForAllProviderRef.current = activeTabForAllProvider;
  }, [activeTabForAllProvider]);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);
  useEffect(() => {
    displayAllSuppliersRef.current = displayAllSuppliers;
  }, [displayAllSuppliers]);

  const onTabChangeForAllProviders = useCallback(
    (_event: unknown, newValue: unknown) => {
      if (typeof newValue === 'object') return;
      const value = newValue as string;

      const tabIndex = getTabIndexForValue(value, true);
      setCurrentTabIndex(tabIndex);
      setActiveTabForAllProvider(value);

      if (value) {
        window.history.pushState(window.config.endpointBase, 'Title', `?tab=${value}`);
      }
      switch (value) {
        case 'chouetteJobs':
          dispatch(getChouetteJobsForAllSuppliers(getToken));
          break;
        case 'events':
          dispatch(fetchAllProviderStatus(getToken));
          break;
        default:
          break;
      }
    },
    [dispatch, getToken]
  );

  const getTabIndexFromParams = useCallback((): number => {
    const param = getQueryVariable('tab');
    switch (param) {
      case 'events':
        return displayAllSuppliers ? 1 : 1;
      case 'chouetteJobs':
        return displayAllSuppliers ? 0 : 2;
      case 'migrateData': {
        if (displayAllSuppliers) {
          onTabChangeForAllProviders(null, 'chouetteJobs');
        }
        return 0;
      }
      case 'statistics':
        return displayAllSuppliers ? 2 : 3;
      case 'exportedFiles':
        if (displayAllSuppliers) {
          return 3;
        } else {
          onTabChangeForAllProviders(null, 'migrateData');
          return 0;
        }
      default:
        return displayAllSuppliers ? 1 : 1;
    }
  }, [displayAllSuppliers, onTabChangeForAllProviders]);

  const onTabChangeForProvider = useCallback(
    (_event: unknown, newValue: unknown) => {
      if (typeof newValue === 'object') return;
      const value = newValue as string;

      const tabIndex = getTabIndexForValue(value, false);
      setCurrentTabIndex(tabIndex);
      setActiveTabForProvider(value);

      if (value) {
        window.history.pushState(
          window.config.endpointBase,
          'Title',
          `?id=${activeId}&tab=${value}`
        );
      }

      switch (value) {
        case 'chouetteJobs':
          dispatch(getChouetteJobStatus(getToken));
          break;
        case 'events':
          dispatch(fetchProviderStatus({ id: activeId, getToken }));
          break;
        default:
          break;
      }
    },
    [activeId, dispatch, getToken]
  );

  // componentWillMount-equivalent for polling — runs once.
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        const queryTab = getQueryVariable('tab');
        const provTab = activeTabForProviderRef.current;
        const allProvTab = activeTabForAllProviderRef.current;
        const allSel = displayAllSuppliersRef.current;
        const aId = activeIdRef.current;

        if (!allSel && provTab === 'chouetteJobs' && aId) {
          dispatch(getChouetteJobStatus(getToken));
        }
        if (allSel && queryTab === 'exportedFiles') {
          dispatch(fetchExportedFiles(getToken));
        }
        if (allSel && allProvTab === 'chouetteJobs') {
          dispatch(getChouetteJobsForAllSuppliers(getToken));
        }
      }, 10000);
    }, 1000);
    return () => {
      clearTimeout(startTimeout);
      if (timer) clearInterval(timer);
    };
  }, [dispatch, getToken]);

  // componentDidMount equivalent — runs once with initial setup.
  useEffect(() => {
    const queryTab = getQueryVariable('tab');
    const queryId = getQueryVariable('id');
    const tabIndex = getTabIndexFromParams();
    setCurrentTabIndex(tabIndex);

    if (queryTab === 'events') {
      if (queryId) {
        dispatch(fetchProviderStatus({ id: queryId, getToken }));
      } else {
        dispatch(fetchAllProviderStatus(getToken));
      }
    } else if (queryTab === 'chouetteJobs') {
      if (queryId) {
        dispatch(getChouetteJobStatus(getToken));
      } else {
        dispatch(getChouetteJobsForAllSuppliers(getToken));
      }
    } else if (queryTab === 'OrganisationRegister') {
      if (queryId) {
        onTabChangeForProvider(null, 'migrateData');
      }
    } else if (queryId === 'exportedFiles') {
      if (queryId) {
        onTabChangeForProvider(null, 'migrateData');
      }
    } else {
      if (queryId) {
        dispatch(fetchProviderStatus({ id: queryId, getToken }));
      } else {
        dispatch(fetchAllProviderStatus(getToken));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // componentDidUpdate(prevProps) equivalent for activeId change.
  const prevActiveIdRef = useRef(activeId);
  useEffect(() => {
    const prevActiveId = prevActiveIdRef.current;
    const tabIndexFromParams = getTabIndexFromParams();

    if (prevActiveId !== activeId) {
      setCurrentTabIndex(tabIndexFromParams);
      const queryTab = getQueryVariable('tab');
      if (queryTab === 'chouetteJobs' && activeId) {
        dispatch(getChouetteJobStatus(getToken));
      }
    }
    prevActiveIdRef.current = activeId;
  }, [activeId, dispatch, getToken, getTabIndexFromParams]);

  // Keep currentTabIndex in sync when params change (mirrors original componentDidUpdate).
  useEffect(() => {
    const tabIndexFromParams = getTabIndexFromParams();
    if (currentTabIndex !== tabIndexFromParams) {
      setCurrentTabIndex(tabIndexFromParams);
    }
  }, [currentTabIndex, getTabIndexFromParams]);

  if (fileListIsLoading) {
    return <LoadingState />;
  }

  const provider =
    !displayAllSuppliers && suppliers.length ? suppliers.find((s: any) => s.id === activeId) : null;

  if (!(displayAllSuppliers || provider)) {
    return null;
  }

  let tabsToRender;

  if (displayAllSuppliers) {
    const currentValue = getTabValueFromIndex(currentTabIndex, true);
    tabsToRender = (
      <Box>
        <Tabs
          value={currentValue}
          onChange={onTabChangeForAllProviders}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="chouetteJobs" label="Chouette jobs" />
          <Tab value="events" label="Events" />
          <Tab value="statistics" label="Statistics" />
          <Tab value="exportedFiles" label="Exported files" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {currentTabIndex === 0 && <ChouetteAllJobs />}
          {currentTabIndex === 1 &&
            (suppliersIsLoading || suppliers.length === 0 ? (
              <LoadingState label="Loading providers…" />
            ) : (
              <EventsView
                providers={suppliers.reduce((acc: Record<string, any>, p: any) => {
                  acc[p.id] = p;
                  return acc;
                }, {})}
              />
            ))}
          {currentTabIndex === 2 && <LineStatisticsView />}
          {currentTabIndex === 3 && <ExportedFilesView />}
        </Box>
      </Box>
    );
  } else {
    const currentValue = getTabValueFromIndex(currentTabIndex, false);
    tabsToRender = (
      <Box>
        <Tabs
          value={currentValue}
          onChange={onTabChangeForProvider}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="migrateData" label="Migrate data" />
          <Tab value="events" label="Events" />
          <Tab value="chouetteJobs" label="Chouette jobs" />
          <Tab value="statistics" label="Statistics" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {currentTabIndex === 0 && <DataMigrationDetails />}
          {currentTabIndex === 1 && provider && (
            <EventsView
              key={`events-${provider.id}`}
              providerId={`${provider.id}`}
              provider={provider}
              providers={suppliers.reduce((acc: Record<string, any>, p: any) => {
                acc[p.id] = p;
                return acc;
              }, {})}
            />
          )}
          {currentTabIndex === 2 && <ChouetteJobDetails />}
          {currentTabIndex === 3 && provider && (
            <LineStatisticsView providerId={`${provider.id}`} />
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        mx: 2.5,
        mb: 2.5,
        px: 1.25,
        pb: 1.25,
        border: '1px solid',
        borderColor: 'divider',
        flexGrow: 1,
      }}
    >
      {tabsToRender}
    </Box>
  );
};

export default SupplierTabWrapper;
