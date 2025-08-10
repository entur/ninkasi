/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React, { useCallback } from 'react';
import { useAuth } from 'react-oidc-context';

const withAuth = Component => {
  const AuthWrapper = props => {
    const auth = useAuth();
    const getToken = useCallback(async () => {
      return auth.user?.access_token;
    }, [auth]);
    return <Component {...props} getToken={getToken} />;
  };
  return AuthWrapper;
};

export default withAuth;
