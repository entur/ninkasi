import type { Config } from '../contexts/ConfigContext';
import { getEnvironment } from './getEnvironment';

let fetchedConfig: Config | undefined = undefined;

export const fetchConfig = async (): Promise<Config> => {
  if (fetchedConfig) {
    return fetchedConfig;
  }

  const env = getEnvironment();
  const { default: config } = await import(`./environments/${env}.json`);
  fetchedConfig = config;

  return fetchedConfig;
};
