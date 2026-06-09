import { Box, Chip, FormLabel, Stack } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useLocale } from '../../../appContext';
import { titleText } from '../../../lineStatistics.constants';

interface Props {
  sorting: number;
  setSorting: (sorting: number) => void;
}

const chipOption = (
  value: number,
  selected: number,
  label: React.ReactNode,
  onClick: () => void
) => (
  <Chip
    key={value}
    clickable
    color={selected === value ? 'primary' : 'default'}
    variant={selected === value ? 'filled' : 'outlined'}
    onClick={onClick}
    label={label}
  />
);

export const SortingChips = ({ sorting, setSorting }: Props) => {
  const locale = useLocale();
  const current = sorting || 1;

  return (
    <Box sx={{ mb: '20px' }}>
      <FormLabel sx={{ display: 'block', mb: 1 }}>{titleText(locale).sortLines}</FormLabel>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {chipOption(
          1,
          current,
          <>
            AZ <ArrowDownwardIcon fontSize="small" />
          </>,
          () => setSorting(1)
        )}
        {chipOption(
          2,
          current,
          <>
            ZA <ArrowUpwardIcon fontSize="small" />
          </>,
          () => setSorting(2)
        )}
        {chipOption(
          4,
          current,
          <>
            {titleText(locale).numberOfDays} <ArrowDownwardIcon fontSize="small" />
          </>,
          () => setSorting(4)
        )}
        {chipOption(
          3,
          current,
          <>
            {titleText(locale).numberOfDays} <ArrowUpwardIcon fontSize="small" />
          </>,
          () => setSorting(3)
        )}
      </Stack>
    </Box>
  );
};
