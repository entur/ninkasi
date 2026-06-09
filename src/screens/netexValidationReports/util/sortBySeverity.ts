import { SEVERITY } from '../model/ValidationReport';

const SEVERITY_LEVELS = [SEVERITY.INFO, SEVERITY.WARNING, SEVERITY.ERROR, SEVERITY.CRITICAL];

export const sortBySeverity = (a: SEVERITY, b: SEVERITY) => {
  return SEVERITY_LEVELS.indexOf(b) - SEVERITY_LEVELS.indexOf(a);
};
