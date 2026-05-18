export const getEnvironment = () => {
  if (window.location.hostname === 'ninkasi.entur.org') {
    return 'prod';
  } else if (window.location.hostname === 'ninkasi.staging.entur.org') {
    return 'test';
  } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'local';
  } else {
    return 'dev';
  }
};
