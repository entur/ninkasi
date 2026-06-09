import { Locale } from './lineStatistics.types';

/** ninkasi is English-only. */
export const useLocale = (): Locale => Locale.EN;

/** ninkasi shows all info cards (no per-tenant flagging here). */
export const useAppConfig = (): {
  showNumberOfLinesCard: boolean;
  showDeliveryDateCard: boolean;
  showExpiringDaysCard: boolean;
} => ({
  showNumberOfLinesCard: true,
  showDeliveryDateCard: true,
  showExpiringDaysCard: true,
});
