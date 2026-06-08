import { Locale, Validity } from './lineStatistics.types';

export const validityCategoryLabel = (locale?: Locale) => ({
  [Validity.INVALID]: textForLocale('Utgåtte linjer', 'Expired lines', locale),
  [Validity.VALID]: textForLocale('Gyldige linjer', 'Valid lines', locale),
  [Validity.EXPIRING]: textForLocale('Utgående linjer', 'Expiring lines', locale),
  [Validity.ALL]: textForLocale('Alle linjer', 'All lines', locale),
});

export const errorText = (locale?: Locale) => ({
  missingLineStatisticsFromOperatorPortal: textForLocale(
    'Kunne ikke laste inn linjestatus for Operatørpotalen.',
    'Could not load line statistics from operator portal.',
    locale
  ),
  failedToLoadData: textForLocale(
    'Kunne ikke laste inn dataene. Prøv igjen senere.',
    'Could not load data. Try again later.',
    locale
  ),
  failedToLoadLatestDate: textForLocale(
    'Oops!! Noen gikk galt.',
    'Oops!! Something went wrong.',
    locale
  ),
});

export const infoText = (locale?: Locale) => ({
  foundNot: function (something: string) {
    return textForLocale(
      `Fant ingen ${(something ?? '').toLowerCase()}`,
      `No ${(something ?? '').toLowerCase()} found`,
      locale
    );
  },
  noLinesFound: textForLocale('Fant ingen linjer', 'No lines found', locale),
  noLinesFoundInfo: textForLocale(
    'Last opp nytt datasett i Operatørportalen eller opprett linjer i Nplan.',
    'Upload new dataset in Operator portal or create lines in Nplan.',
    locale
  ),
});

export const titleText = (locale?: Locale) => ({
  sortLines: textForLocale('Sorter linjer', 'Sort lines', locale),
  selectLines: textForLocale('Velg linjer ', 'Select lines', locale),
  lineStatisticsFromChouette: textForLocale(
    'Linjestatus for rutedata',
    'Line statistics for timetable data',
    locale
  ),
  numberOfLines: textForLocale('Antall linjer', 'Number of lines', locale),
  showLines: textForLocale('Vis linjer', 'Show lines', locale),
  latestDeliveryDate: textForLocale('Dato for siste leveranse', 'Latest delivery date', locale),
  daysToFirstExpiringLine: textForLocale(
    'Dager til første utgående linje',
    'Days to first outgoing line',
    locale
  ),
  days: textForLocale('dager', 'days', locale),
  numberOfDays: textForLocale('Antall dager', 'Number of days', locale),
  back: textForLocale('tilbake', 'back', locale),
  noLongerValid: function (lineNumber: string) {
    return textForLocale(
      `Linje ${lineNumber} er ikke gyldig lenger.`,
      `Line ${lineNumber} is no longer valid.`,
      locale
    );
  },
  expiringLine: function (lineNumber: string, numberOfDays: number) {
    return textForLocale(
      `Linje ${lineNumber} utløper om ${numberOfDays} dager.`,
      `Line ${lineNumber} is expiring in ${numberOfDays} days.`,
      locale
    );
  },
  validLine: function (lineNumber: string, numberOfDays: number) {
    return textForLocale(
      `Linje ${lineNumber} har gyldige data for ${numberOfDays} dager.`,
      `Line ${lineNumber} has valid data for ${numberOfDays} days.`,
      locale
    );
  },
});

const textForLocale = (norwegianText: string, englishText: string, locale?: Locale) =>
  locale === Locale.NO ? norwegianText : englishText;

/**
 * Shared visual tokens. Replaces the `:root` CSS variables and `:export` block
 * that used to live in `src/app.module.scss` in ninsar.
 */
export const VALID_LINE_PERCENTAGE = 67;

export const palette = {
  valid: '#33c146',
  expired: '#b20000',
  expiring: '#ffaa00',
  validHighlight: '#4caf50',
  expiredHighlight: '#cc0000',
  expiringHighlight: '#ffb60a',
  expiredLight: '#f6c0c0',
  validLight: '#c3e2c3',
  expiringLight: '#ffe4b4',
};
