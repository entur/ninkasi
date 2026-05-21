export { AuthProvider } from './AuthProvider';

import { useAuth as useOidcAuth } from 'react-oidc-context';

let localDevAccessToken: string | undefined;

export const fetchAndCacheLocalDevToken = async (tokenUrl: string): Promise<void> => {
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials&client_id=ninkasi&client_secret=notUsed',
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch local dev token: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  localDevAccessToken = data.access_token;
};

const localAuth = {
  isAuthenticated: true,
  isLoading: false,
  user: {
    get access_token() {
      return localDevAccessToken;
    },
    token_type: 'Bearer',
    profile: {
      sub: 'local-dev',
      name: 'Local Dev',
      email: 'dev@localhost',
      'https://ror.entur.io/role_assignments': [{ r: 'route_data_admin', o: 'RB' }],
    },
  },
  signinRedirect: async () => {},
  signoutRedirect: async () => {},
} as any;

export const useAuth = () => {
  if ((window as any).config?.defaultAuthMethod === 'local') {
    return localAuth;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks -- auth method is fixed at app start; hook order stays stable per session
  return useOidcAuth();
};
