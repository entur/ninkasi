import type { TimetableJobEvent } from '../types/event';

// Rows are keyed on identity, not list position: the 5s poll replaces the whole
// array, and a position-based key remounts rows and drops expanded state. Some
// rows carry no job id and no filename, and two of those can share a millisecond
// timestamp, so the occurrence counter is what makes the key unique at all.
export const buildRowKeys = (events: TimetableJobEvent[]): string[] => {
  const seen = new Map<string, number>();
  return events.map(event => {
    const base = [
      event.chouetteJobId,
      event.providerId ?? event.provider?.id,
      event.fileName,
      event.firstEvent,
    ].join('-');
    const occurrence = (seen.get(base) ?? 0) + 1;
    seen.set(base, occurrence);
    return `${base}#${occurrence}`;
  });
};
