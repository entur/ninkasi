import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const namespace = 'https://ror.api.dev.entur.io/claims/role_assignments';

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
          roleAssignments: idToken ? idToken[namespace] : null,
          getAccessTokenSilently,
          logout
        })}
    </>
  );
};
