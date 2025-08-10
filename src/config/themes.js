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

export const getProvidersEnv = providersBaseUrl => {
  if (providersBaseUrl) {
    if (providersBaseUrl.indexOf('api.staging.entur.io') > -1) {
      return 'TEST';
    } else if (providersBaseUrl.indexOf('api.entur.io') > -1) {
      return 'PROD';
    } else {
      return 'DEV';
    }
  }
};

export const getTheme = env => {
  return themes[env || 'DEV'];
};

export const getIconColor = env => {
  return iconColor[env || 'DEV'];
};

const themes = {
  PROD: {
    backgroundColor: '#2f2f2f',
    color: '#fff',
  },
  TEST: {
    backgroundColor: '#d18e25',
    color: '#fff',
  },
  DEV: {
    backgroundColor: '#457645',
    color: '#fff',
  },
};

const iconColor = {
  PROD: '#FBB829',
  TEST: '#FBB829',
  DEV: '#fff',
};
