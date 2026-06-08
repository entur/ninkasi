import { Validity } from '../../../lineStatistics.types';
import type { LineStatistics } from '../../../lineStatistics.types';

export const sortLines = (
  sorting: number,
  lineStatistics: LineStatistics,
  selectedValidityCategory: Validity
) => {
  const linesNumbersForSelectedValidityCategory =
    lineStatistics.validityCategories.get(selectedValidityCategory);

  if (linesNumbersForSelectedValidityCategory) {
    switch (sorting) {
      default:
        return linesNumbersForSelectedValidityCategory;
      case 1:
        return [...linesNumbersForSelectedValidityCategory].sort((a, b) => {
          return a.localeCompare(b, 'nb', {
            numeric: true,
            sensitivity: 'base',
          });
        });
      case 2:
        return [...linesNumbersForSelectedValidityCategory].sort((a, b) => {
          return b.localeCompare(a, 'nb', {
            numeric: true,
            sensitivity: 'base',
          });
        });
      case 3: {
        const daysAsc = sortDaysValidInLineStatistics(lineStatistics, true);
        return daysAsc.filter(
          lineNumber => linesNumbersForSelectedValidityCategory.indexOf(lineNumber) !== -1
        );
      }
      case 4: {
        const daysDesc = sortDaysValidInLineStatistics(lineStatistics, false);
        return daysDesc.filter(
          lineNumber => linesNumbersForSelectedValidityCategory.indexOf(lineNumber) !== -1
        );
      }
    }
  }
};

export const sortDaysValidInLineStatistics = (
  lineStatistics: LineStatistics,
  ascending = true
): string[] =>
  Object.keys(lineStatistics.linesMap)
    .map(lineNumber => ({
      lineNumber: lineNumber,
      daysValid: lineStatistics.linesMap[lineNumber].daysValid,
    }))
    .sort((a, b) => {
      if (a.daysValid === b.daysValid) {
        return 0;
      } else if (a.daysValid < b.daysValid) {
        return ascending ? -1 : 1;
      } else {
        return ascending ? 1 : -1;
      }
    })
    .map(val => val.lineNumber);
