import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default ({ children }) => {
  const {
    isLoading,
    isAuthenticated,
    user,
    loginWithRedirect,
    getIdTokenClaims,
    getAccessTokenSilently,
    logout
  } = useAuth0();
  const [idToken, setIdToken] = useState();

  useEffect(() => {
    const getClaims = async () => setIdToken(await getIdTokenClaims());
    getClaims();
  }, [getIdTokenClaims]);

  if (!isAuthenticated && !isLoading) {
    return loginWithRedirect();
  }

  return (
    <>
      {!isLoading &&
        children({
          user,
          idToken,
          getAccessTokenSilently,
          logout
        })}
    </>
  );
};
