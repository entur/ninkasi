import uuid from 'uuid/v4';

const getConfig = async getToken => {
  const config = {};
  const accessToken = await getToken();
  config.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + accessToken,
    'X-Correlation-Id': uuid(),
    'Et-Client-Name': 'entur-ninkasi',
  };
  return config;
};

export default getConfig;
