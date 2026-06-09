import { Box, Chip, FormLabel, Stack } from '@mui/material';
import { useLocale } from '../../../appContext';
import { titleText, validityCategoryLabel } from '../../../lineStatistics.constants';
import { Validity } from '../../../lineStatistics.types';

interface Props {
  selectedValidity: Validity;
  setSelectedValidity: (selectedValidity: Validity) => void;
}

export const ValidityChips = ({ selectedValidity, setSelectedValidity }: Props) => {
  const locale = useLocale();

  const options: Validity[] = [Validity.ALL, Validity.VALID, Validity.INVALID, Validity.EXPIRING];

  return (
    <Box sx={{ mb: '20px' }}>
      <FormLabel sx={{ display: 'block', mb: 1 }}>{titleText(locale).selectLines}</FormLabel>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {options.map(value => (
          <Chip
            key={value}
            clickable
            color={selectedValidity === value ? 'primary' : 'default'}
            variant={selectedValidity === value ? 'filled' : 'outlined'}
            onClick={() => setSelectedValidity(value)}
            label={validityCategoryLabel(locale)[value]}
          />
        ))}
      </Stack>
    </Box>
  );
};
