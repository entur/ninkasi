import type { Config } from '../contexts/ConfigContext';

let fetchedConfig: Config | undefined = undefined;

/**
 * Loads runtime config from /config.json.
 *
 * The repo ships `public/config.json` with local-dev defaults, plus
 * `public/config.{dev,staging,prod}.json` env-specific bundles. At deploy
 * time the CI pipeline copies the right env file over `config.json` before
 * uploading to Firebase, so the same build artifact serves all envs.
 */
export const fetchConfig = async (): Promise<Config> => {
  if (fetchedConfig) return fetchedConfig;

  const response = await fetch('config.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load config.json: ${response.status} ${response.statusText}`);
  }
  fetchedConfig = (await response.json()) as Config;
  return fetchedConfig;
};
