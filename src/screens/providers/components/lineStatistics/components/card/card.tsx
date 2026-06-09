import type { ReactElement } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { SxProps, Theme } from '@mui/material/styles';
import { titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../appContext';

interface Props {
  handleClose?: () => void;
  children: ReactElement | ReactElement[];
  sx?: SxProps<Theme>;
  title?: string;
  subTitle?: string;
}

export const Card = ({ handleClose, children, sx, title, subTitle }: Props) => {
  const locale = useLocale();

  return (
    <>
      {handleClose && (
        <Box sx={{ ml: '10px', mt: '20px' }}>
          <Button variant="text" size="medium" startIcon={<ArrowBackIcon />} onClick={handleClose}>
            {titleText(locale).back}
          </Button>
        </Box>
      )}
      <Box
        sx={[
          {
            boxShadow: '#d8d8d8 0 1px 6px, #d8d8d8 0 1px 4px',
            borderRadius: '2px',
            height: 'fit-content',
            m: '20px 10px',
            p: '15px',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {title && (
          <Typography variant="h2" sx={{ m: 0 }}>
            {title}
          </Typography>
        )}
        {subTitle && <Typography variant="h3">{subTitle}</Typography>}
        {children}
      </Box>
    </>
  );
};
