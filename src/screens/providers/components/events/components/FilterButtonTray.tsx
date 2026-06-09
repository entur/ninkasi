import { Box, Chip, Stack, Typography } from '@mui/material';
import actionTranslations from './actionTranslations';
import type { ButtonConfig } from './buttonConfig';

type TranslationKey = 'states' | 'filterButton';

interface Props {
  label: string;
  activeButtonId: string;
  onChange: (id: string) => void;
  buttonConfig: ButtonConfig;
  translationKey: TranslationKey;
}

const FilterButtonTray = ({
  label,
  activeButtonId,
  onChange,
  buttonConfig,
  translationKey,
}: Props) => {
  const translations = actionTranslations[translationKey];

  return (
    <Box sx={{ mx: 2, mb: '20px' }}>
      <Box sx={{ mb: '0.5rem' }}>
        <Typography variant="body2" component="span">
          {label}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {buttonConfig.fields.map(field => {
          const selected = field.id === activeButtonId;
          return (
            <Chip
              key={field.id}
              label={translations[field.id] ?? field.id}
              clickable
              color={selected ? 'primary' : 'default'}
              variant={selected ? 'filled' : 'outlined'}
              onClick={() => onChange(field.id)}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default FilterButtonTray;
