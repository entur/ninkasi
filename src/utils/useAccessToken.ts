import { useCallback } from 'react';
import { useAuth } from 'react-oidc-context';

/**
 * Hook form of the access-token getter. Mirrors the shape of `withAuth`'s
 * `getToken` prop so it can be used directly inside hooks and effects.
 */
export const useAccessToken = () => {
  const auth = useAuth();
  const getToken = useCallback(async () => {
    return auth.user?.access_token ?? '';
  }, [auth]);
  return { getToken };
};
