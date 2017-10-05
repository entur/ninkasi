export const getProvidersEnv = providersBaseUrl => {
  if (providersBaseUrl) {
    if (providersBaseUrl.indexOf('api-test.entur.org') > -1) {
      return 'TEST';
    } else if (providersBaseUrl.indexOf('api.entur.org') > -1) {
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
    color: '#fff'
  },
  TEST: {
    backgroundColor: 'green',
    color: '#fff'
  },
  DEV: {
    backgroundColor: 'orange',
    color: '#fff'
  }
};

const iconColor = {
  PROD: '#FBB829',
  TEST: '#FBB829',
  DEV: '#fff'
};
