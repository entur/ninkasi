export enum SEVERITY {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export type ValidationReportEntry = {
  severity: SEVERITY;
  name: string;
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  objectId: string;
  message: string;
};

export type ValidationReport = {
  codespace: string;
  creationDate: string;
  validationReportId: string;
  validationReportEntries: ValidationReportEntry[];
};
