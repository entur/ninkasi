import { Box, Button, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip as ChartTooltip } from 'chart.js';
import type { ActiveElement, ChartEvent, ChartType, DefaultDataPoint } from 'chart.js';
import type { Validity } from '../../lineStatistics.types';
import { generatePieChartData } from './pieStatistics.data';
import type { NumberOfLinesType } from './pieStatistics.types';
import { titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../appContext';

ChartJS.register(ArcElement, ChartTooltip, Legend);

interface Props {
  handlePieOnClick: (label: Validity) => void;
  handleShowAllClick: () => void;
  showHeader: boolean;
  providerName: string;
  pieWidth?: number;
  pieHeight?: number;
  numberOfLines: NumberOfLinesType;
  pieContainerWidth?: number | string;
  showLineButton: boolean;
}

export const PieStatistics = ({
  providerName,
  handlePieOnClick,
  handleShowAllClick,
  showHeader,
  pieHeight = 180,
  pieWidth = 230,
  numberOfLines,
  pieContainerWidth,
  showLineButton,
}: Props) => {
  const locale = useLocale();

  const totalNumberOfLines = {
    id: 'totalNumberOfLines',
    beforeDatasetsDraw(chart: ChartJS) {
      const { ctx, data, legend } = chart;

      const hiddenLegends = legend?.legendItems?.filter(item => item.hidden);
      const hiddenLegendsIndexes = hiddenLegends?.map(item => legend?.legendItems?.indexOf(item));

      const dataNotHidden = data.datasets[0].data.filter(
        (_value, index) => !hiddenLegendsIndexes?.includes(index)
      );

      ctx.save();
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${dataNotHidden.map(d => Number(d)).reduce((a, b) => (a ?? 0) + (b ?? 0), 0)}`,
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y
      );
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...(pieContainerWidth !== undefined && {
          '& > *': { width: pieContainerWidth },
        }),
      }}
    >
      {showHeader && (
        <Box
          sx={{
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ m: 0 }}>
            {providerName}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          width: `${pieWidth}px`,
          height: `${pieHeight}px`,
          m: '10px 0',
        }}
      >
        <Doughnut
          data={generatePieChartData(numberOfLines)}
          plugins={[totalNumberOfLines]}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            onClick(
              _event: ChartEvent,
              elements: ActiveElement[],
              chart: ChartJS<ChartType, DefaultDataPoint<ChartType>, Validity>
            ) {
              if (chart.data.labels && chart.data.labels.length > 0 && elements.length > 0) {
                handlePieOnClick(chart.data.labels[elements[0].index]);
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  title: context => {
                    const label = context[0].label;
                    return label.charAt(0) + label.slice(1).toLowerCase();
                  },
                  label: context => {
                    const { chart } = context;
                    return `${chart.data.datasets[context.datasetIndex].data[context.dataIndex]}`;
                  },
                },
                backgroundColor: '#FFF',
                titleAlign: 'center',
                titleFont: {
                  size: 16,
                },
                titleColor: '#0066ff',
                titleMarginBottom: 10,
                bodyColor: '#000',
                bodyAlign: 'center',
                bodyFont: {
                  size: 14,
                },
                displayColors: false,
                borderColor: '#0066ff',
                borderWidth: 1,
              },
              legend: {
                labels: {
                  usePointStyle: true,
                  pointStyle: 'rectRounded',
                },
                align: 'start',
                position: 'bottom',
              },
            },
          }}
        />
      </Box>

      {showLineButton && (
        <Button fullWidth variant="text" size="medium" onClick={handleShowAllClick}>
          {titleText(locale).showLines}
        </Button>
      )}
    </Box>
  );
};
