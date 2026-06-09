import type { NumberOfLinesType } from './pieStatistics.types';
import { Validity } from '../../lineStatistics.types';

export const color = {
  valid: '#33c146',
  expiring: '#FFB60A',
  expired: '#cc0000',
  highlight: {
    valid: '#4caf50',
    expired: '#b20000',
    expiring: '#FFAA00',
  },
};

export const generatePieChartData = ({
  numberOfValidLines,
  numberOfExpiringLines,
  numberOfExpiredLines,
}: NumberOfLinesType) => ({
  labels: [Validity.VALID, Validity.EXPIRING, Validity.INVALID],
  datasets: [
    {
      data: [numberOfValidLines, numberOfExpiringLines, numberOfExpiredLines],
      backgroundColor: [color.valid, color.expiring, color.expired],
      hoverBackgroundColor: [
        color.highlight.valid,
        color.highlight.expiring,
        color.highlight.expired,
      ],
    },
  ],
});
