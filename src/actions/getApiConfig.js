import { v4 as uuid } from 'uuid';

const getConfig = async getToken => {
  const config = {};
  const isLocal = window.config?.defaultAuthMethod === 'local';
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Correlation-Id': uuid(),
    'Et-Client-Name': 'entur-ninkasi',
  };
  if (!isLocal) {
    const accessToken = await getToken();
    headers.Authorization = 'Bearer ' + accessToken;
  }
  config.headers = headers;
  return config;
};

export default getConfig;
