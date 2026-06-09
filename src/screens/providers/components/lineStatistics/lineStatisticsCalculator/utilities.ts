import { addDays, differenceInDays, differenceInMilliseconds, isWithinInterval } from 'date-fns';
import { Validity } from '../lineStatistics.types';

const MS_PER_DAY = 86_400_000;

// Fractional-day diff (moment's `.diff(other, 'days', true)` returns
// `(this - other) / 86400000`).  date-fns has `differenceInDays` but it
// truncates toward zero; we keep the original fractional behaviour because
// the timeline-position math relies on it.
const diffInFractionalDays = (a: Date, b: Date) => differenceInMilliseconds(a, b) / MS_PER_DAY;

export const findTimeLineStartPositionForEffectivePeriod = (
  effectivePeriodFrom: Date,
  startDateLine: Date,
  days: number
) => {
  const fromDiff = diffInFractionalDays(startDateLine, effectivePeriodFrom);
  return fromDiff > 0 ? 0 : (Math.abs(fromDiff) / days) * 100;
};

export const findTimeLineEndPositionForEffectivePeriod = (
  effectivePeriodTo: Date,
  endDateLine: Date,
  days: number
) => {
  const toDiff = diffInFractionalDays(endDateLine, addDays(effectivePeriodTo, 1));
  return Math.max(toDiff > 0 ? 100 - toDiff / (days / 100) : 100, 0);
};

export const findTimeLineStartPositionForTimeTable = (
  periodFrom: string,
  startDateLine: Date,
  days: number
) => {
  const fromDiff = diffInFractionalDays(startDateLine, new Date(periodFrom));

  return fromDiff < 0 ? (Math.abs(fromDiff) / days) * 100 : 0;
};

export const findTimeLineEndPositionForTimeTable = (
  periodTo: string,
  endDateLine: Date,
  days: number
) => {
  const toDiff = diffInFractionalDays(endDateLine, addDays(new Date(periodTo), 1));
  return Math.max(toDiff > 0 ? 100 - toDiff / (days / 100) : 100, 0);
};

export const findValidity = (daysForward: number) => {
  if (daysForward <= 0 || daysForward === Infinity) {
    return Validity.INVALID;
  } else if (daysForward >= 120) {
    return Validity.VALID;
  }
  return Validity.EXPIRING;
};

export const validPeriod = (startDate: Date, effectivePeriodFrom: Date, effectivePeriodTo: Date) =>
  isWithinInterval(addDays(startDate, 1), {
    start: effectivePeriodFrom,
    end: effectivePeriodTo,
  })
    ? effectivePeriodTo
    : startDate;

export const getDaysRange = (startDate: Date, end: Date | undefined): number | undefined =>
  end instanceof Date ? differenceInDays(end, startDate) : undefined;
