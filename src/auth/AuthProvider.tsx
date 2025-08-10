import React from 'react';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { useConfig } from '../contexts/ConfigContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const config = useConfig();

  const oidcConfig = {
    authority: `https://${config.auth0Domain}`,
    client_id: config.auth0ClientId!,
    redirect_uri: window.location.origin,
    response_type: 'code' as const,
    scope: 'openid profile email',
    automaticSilentRenew: true,
    includeIdTokenInSilentRenew: true,
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
