import moment from 'moment';
import type { Moment } from 'moment';
import { Validity } from '../lineStatistics.types';

export const findTimeLineStartPositionForEffectivePeriod = (
  effectivePeriodFrom: Moment,
  startDateLine: Moment,
  days: number
) => {
  const fromDiff = startDateLine.diff(effectivePeriodFrom, 'days', true);
  return fromDiff > 0 ? 0 : (Math.abs(fromDiff) / days) * 100;
};

export const findTimeLineEndPositionForEffectivePeriod = (
  effectivePeriodTo: Moment,
  endDateLine: Moment,
  days: number
) => {
  const toDiff = moment(endDateLine, 'YYYY-MM-DD').diff(
    moment(effectivePeriodTo, 'YYYY-MM-DD').add(1, 'days'),
    'days',
    true
  );
  return Math.max(toDiff > 0 ? 100 - toDiff / (days / 100) : 100, 0);
};

export const findTimeLineStartPositionForTimeTable = (
  periodFrom: string,
  startDateLine: Moment,
  days: number
) => {
  const fromDiff = startDateLine.diff(moment(periodFrom, 'YYYY-MM-DD'), 'days', true);

  return fromDiff < 0 ? (Math.abs(fromDiff) / days) * 100 : 0;
};

export const findTimeLineEndPositionForTimeTable = (
  periodTo: string,
  endDateLine: Moment,
  days: number
) => {
  const toDiff = moment(endDateLine, 'YYYY-MM-DD').diff(
    moment(periodTo, 'YYYY-MM-DD').add(1, 'days'),
    'days',
    true
  );
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

export const validPeriod = (
  startDate: Moment,
  effectivePeriodFrom: Moment,
  effectivePeriodTo: Moment
) =>
  moment(startDate).add(1, 'days').isBetween(effectivePeriodFrom, effectivePeriodTo, 'days', '[]')
    ? effectivePeriodTo
    : startDate;

export const getDaysRange = (startDate: Moment, end: Moment | undefined): number | undefined =>
  end && moment.isMoment(end) ? end.diff(startDate, 'days') : undefined;
