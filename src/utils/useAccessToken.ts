import { useCallback, useRef } from 'react';
import { useAuth } from '@/auth';

/**
 * Hook that returns a `getToken()` callback resolving to the current access
 * token (or '' if unauthenticated), for use inside hooks and effects.
 *
 * Imports `useAuth` from `@/auth` — not `react-oidc-context` directly — so
 * `auth.user` is also populated in local auth-bypass mode, where there is no
 * OIDC provider. See `src/auth/index.ts`.
 *
 * `getToken` is read through a ref so its identity never changes: the auth
 * context object is replaced on every silent renew, and a changing `getToken`
 * re-triggers every effect that lists it, refetching each admin view on each
 * token refresh.
 */
export const useAccessToken = () => {
  const auth = useAuth();
  const authRef = useRef(auth);
  authRef.current = auth;

  const getToken = useCallback(async () => {
    return authRef.current.user?.access_token ?? '';
  }, []);

  return { getToken };
};
