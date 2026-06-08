import { Validity } from '../../lineStatistics.types';
import type { LineStatistics } from '../../lineStatistics.types';
import type { NumberOfLinesType } from '../pieStatistics/pieStatistics.types';

const numberOfLinesForValidityCategory = (validity: Validity, lineStatistics?: LineStatistics) =>
  lineStatistics?.validityCategories.get(validity)?.length ?? 0;

export const getNumberOfLinesType = (lineStatistics?: LineStatistics): NumberOfLinesType => ({
  totalNumberOfLines: numberOfLinesForValidityCategory(Validity.ALL, lineStatistics),
  numberOfValidLines: numberOfLinesForValidityCategory(Validity.VALID, lineStatistics),
  numberOfExpiredLines: numberOfLinesForValidityCategory(Validity.INVALID, lineStatistics),
  numberOfExpiringLines: numberOfLinesForValidityCategory(Validity.EXPIRING, lineStatistics),
});
