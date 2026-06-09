import { useCallback } from 'react';
import { useAuth } from '@/auth';

/**
 * Hook that returns a `getToken()` callback resolving to the current access
 * token (or '' if unauthenticated), for use inside hooks and effects.
 *
 * Imports `useAuth` from `@/auth` — not `react-oidc-context` directly — so
 * `auth.user` is also populated in local auth-bypass mode, where there is no
 * OIDC provider. See `src/auth/index.ts`.
 */
export const useAccessToken = () => {
  const auth = useAuth();
  const getToken = useCallback(async () => {
    return auth.user?.access_token ?? '';
  }, [auth]);
  return { getToken };
};
