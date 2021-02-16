import uuid from 'uuid/v4';

const getConfig = async auth => {
  let config = {};
  const accessToken = await auth.getAccessToken();
  config.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + accessToken,
    'X-Correlation-Id': uuid()
  };
  return config;
};

export default getConfig;
