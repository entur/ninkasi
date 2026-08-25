import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import { selectActiveSupplier } from 'reducers/SuppliersReducer';

/** Selects a provider exactly as the "All providers" dropdown does. */
export const useSelectProvider = () => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();

  return useCallback(
    (providerId: number) => {
      dispatch(selectActiveSupplier(providerId, getToken));
    },
    [dispatch, getToken]
  );
};
