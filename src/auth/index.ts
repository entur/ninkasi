export { AuthProvider } from './AuthProvider';

import { useAuth as useOidcAuth } from 'react-oidc-context';

const localAuth = {
  isAuthenticated: true,
  isLoading: false,
  user: {
    access_token: 'local-dev-token',
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
