import { Chip, Stack, Typography } from '@mui/material';
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
    <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
      <Typography variant="body2" component="span" color="text.secondary">
        {label}
      </Typography>
      {buttonConfig.fields.map(field => {
        const selected = field.id === activeButtonId;
        return (
          <Chip
            key={field.id}
            size="small"
            label={translations[field.id] ?? field.id}
            clickable
            color={selected ? 'primary' : 'default'}
            variant={selected ? 'filled' : 'outlined'}
            onClick={() => onChange(field.id)}
          />
        );
      })}
    </Stack>
  );
};

export default FilterButtonTray;
