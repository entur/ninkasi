import type { LineStatistics } from '../lineStatistics.types';

export type FetchError = {
  status: number;
  statusText: string;
};

export type LineStatisticsPerProviderId = {
  [providerId: string]: LineStatistics;
};

export interface LatestDeliveryDateResponse {
  state: string;
  date: number;
  fileName: string;
}
