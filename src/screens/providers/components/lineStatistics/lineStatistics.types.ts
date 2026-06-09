export type LineNumbers = string[];

export interface LineStatistics {
  providerName?: string;
  startDate: string;
  endDate: string;
  requiredValidityDate: string;
  linesMap: LinesMap;
  validityCategories: Map<Validity, LineNumbers>;
  validityCategoriesCount?: Map<Validity, number>;
}

export type LinesMap = { [lineNumber: string]: PublicLineValidity };

export interface PeriodValidity extends Period {
  timelineEndPosition: number;
  timelineStartPosition: number;
}

export enum Validity {
  INVALID = 'INVALID', // Expired
  VALID = 'VALID',
  EXPIRING = 'EXPIRING',
  ALL = 'ALL',
}

export interface Period {
  from: string;
  to: string;
}

export interface Timetable {
  objectId: string;
  periods: Period[] | PeriodValidity[];
}

export interface Line {
  timetables: Timetable[];
}

export interface PublicLine {
  lineNumber: string;
  lineNames: string[];
  effectivePeriods: Period[] | PeriodValidity[];
  lines: Line[];
}

export interface PublicLineValidity extends PublicLine {
  daysValid: number;
}

export enum Locale {
  NO = 'NO',
  EN = 'EN',
}
