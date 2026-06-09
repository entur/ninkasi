import { SEVERITY } from '../model/ValidationReport';
import type { ValidationReportEntry } from '../model/ValidationReport';

export type GroupedEntry = {
  count: number;
  severity: SEVERITY;
  groupedEntries?: Map<keyof ValidationReportEntry, GroupedEntry>;
  entries?: ValidationReportEntry[];
};

export const groupReportEntries = (
  entries: ValidationReportEntry[],
  field: keyof ValidationReportEntry,
  subField?: keyof ValidationReportEntry
): Map<keyof ValidationReportEntry, GroupedEntry> => {
  const groupedReportEntries = entries.reduce<Map<keyof ValidationReportEntry, GroupedEntry>>(
    (entryMap, entry) => {
      const key = entry[field] as keyof ValidationReportEntry;
      const current = entryMap.get(key);
      const severity = getSeverity(current?.severity, entry.severity);
      const subEntries = current?.entries || [];
      subEntries.push(entry);
      entryMap.set(key, {
        severity,
        count: subEntries.length,
        entries: subEntries,
      });
      return entryMap;
    },
    new Map()
  );
  return postProcess(groupedReportEntries, subField);
};

export const postProcess = (
  grouped: Map<keyof ValidationReportEntry, GroupedEntry>,
  subField?: keyof ValidationReportEntry
): Map<keyof ValidationReportEntry, GroupedEntry> => {
  grouped.forEach(groupedEntry => {
    if (subField) {
      groupedEntry.groupedEntries = groupedEntry.entries
        ? groupReportEntries(groupedEntry.entries, subField)
        : undefined;
    }

    groupedEntry.count = groupedEntry.entries?.length || 0;
  });
  return grouped;
};

const getSeverity = (current: SEVERITY | undefined, next: SEVERITY) => {
  if (current && current > next) {
    return current;
  }
  return next;
};
