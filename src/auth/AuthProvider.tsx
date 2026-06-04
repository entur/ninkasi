import React from 'react';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';
import { useConfig } from '../contexts/ConfigContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const config = useConfig();

  if (config.defaultAuthMethod === 'local') {
    return <>{children}</>;
  }

  const oidcConfig = {
    authority: `https://${config.auth0Domain}`,
    client_id: config.auth0ClientId!,
    redirect_uri: window.location.origin,
    response_type: 'code' as const,
    scope: 'openid profile email',
    automaticSilentRenew: true,
    includeIdTokenInSilentRenew: true,
    // Persist the user across tab close and refresh; oidc-client-ts
    // defaults to sessionStorage which is wiped when the tab closes.
    // To clear a stale session: delete the localStorage key
    // "oidc.user:<authority>:<client_id>".
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    extraQueryParams: config.auth0Audience ? { audience: config.auth0Audience } : undefined,
  };

  return (
    <OidcAuthProvider
      {...oidcConfig}
      onSigninCallback={() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }}
    >
      {children}
    </OidcAuthProvider>
  );
};
