import React, { useContext } from 'react';

export interface Config {
  appEnv?: string;

  /**
   * Optional environment chip next to the wordmark (e.g. "dev", "staging").
   * Absent → no chip rendered. Prod typically omits this so the badge hides.
   */
  envLabel?: string;
  /**
   * Background color for the env chip (any CSS color).
   * Per-env conventions: green for dev, orange for staging, hide in prod.
   */
  envLabelColor?: string;

  auth0Domain?: string;
  auth0ClientId?: string;
  auth0Audience?: string;
  auth0ClaimsNamespace?: string;
  defaultAuthMethod?: string;
  mockOauth2TokenUrl?: string;

  providersBaseUrl?: string;
  organisationsBaseUrl?: string;
  eventsBaseUrl?: string;
  timetableAdminBaseUrl?: string;
  mapAdminBaseUrl?: string;
  mapboxAdminBaseUrl?: string;
  stopPlaceBaseUrl?: string;
  uttuBaseUrl?: string;
  organisationRegisterBaseUrl?: string;
  noonReportBaseUrl?: string;

  endpointBase?: string;
  netexPrefix?: string;
  enableGoogleTasks?: boolean;

  chouetteBaseUrl?: string;
  udugBaseUrl?: string;
  enturPartnerUrl?: string;

  // Inlined-MF API URLs
  timetableValidationApiUrl?: string;
  timetableEventsApiUrl?: string;
  timetableAdminApiUrl?: string;
  kililiApiUrl?: string;
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
