import { Config } from '../contexts/ConfigContext';

declare global {
  interface Window {
    config: Config;
  }
}

export {};
