import React, { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

export default ({ children, config }) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    let token;
    const kc = new Keycloak(config.endpointBase + 'config/keycloak.json');
    kc.init({ onLoad: 'login-required', checkLoginIframe: false }).success(
      authenticated => {
        if (authenticated) {
          token = kc.token;

          const update = () => {
            setAuth({
              user: {
                name: kc.tokenParsed.preferred_username
              },
              roleAssignments: kc.tokenParsed.roles,
              getAccessTokenSilently: async () => {
                return token;
              },
              logout: () => kc.logout()
            });
          };

          update();

          const updater = setInterval(() => {
            kc.updateToken(10).error(() => kc.logout());
            token = kc.token;
          }, 10000);
          return () => {
            clearInterval(updater);
          };
        } else {
          kc.login();
        }
      }
    );
  }, [config.endpointBase]);

  return <>{children(auth)}</>;
};
