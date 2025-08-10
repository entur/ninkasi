import React, { useContext } from 'react';

export interface Config {
  auth0Domain?: string;
  auth0ClientId?: string;
  auth0Audience?: string;
  auth0ClaimsNamespace?: string;
  timetableAdminBaseUrl?: string;
  mapAdminBaseUrl?: string;
  stopPlaceBaseUrl?: string;
  geocoderBaseUrl?: string;
  mapboxAdminBaseUrl?: string;
  enableGoogleTasks?: boolean;
  defaultAuthMethod?: string;
  netexPrefix?: string;
  uttuBaseUrl?: string;
  organisationRegisterBaseUrl?: string;
  noonReportBaseUrl?: string;
  providersBaseUrl?: string;
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
