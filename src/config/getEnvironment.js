export const getEnvironment = () => {
  if (window.location.hostname === 'ninkasi.entur.org') {
    return 'prod';
  } else if (window.location.hostname === 'ninkasi.staging.entur.org') {
    return 'test';
  } else {
    return 'dev';
  }
};
