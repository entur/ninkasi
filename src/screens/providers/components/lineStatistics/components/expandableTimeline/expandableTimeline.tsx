import type React from 'react';
import type { CSSProperties } from 'react';
import { Box, Collapse, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { PeriodValidity } from '../../lineStatistics.types';
import { VALID_LINE_PERCENTAGE, palette } from '../../lineStatistics.constants';

interface Props {
  lineNumber: string;
  lineNames: string;
  effectivePeriodsForLineNumber: PeriodValidity[];
  children: React.ReactNode;
  id: string;
  open: boolean;
  onToggle: () => void;
  contentStyle?: CSSProperties | undefined;
  linesValidityListHeader: React.ReactNode;
  numberOfDaysHeader: React.ReactNode;
}

export const ExpandableTimeline = ({
  effectivePeriodsForLineNumber,
  lineNumber,
  lineNames,
  children,
  id,
  open,
  onToggle,
  contentStyle,
  linesValidityListHeader,
  numberOfDaysHeader,
}: Props) => {
  const getTimelineStyle = (index: number, effectivePeriod: PeriodValidity) => {
    const width = effectivePeriod.timelineEndPosition - effectivePeriod.timelineStartPosition;

    const marginLeft =
      index === 0
        ? effectivePeriod.timelineStartPosition
        : effectivePeriod.timelineStartPosition -
          effectivePeriodsForLineNumber[index - 1].timelineEndPosition;

    if (width === 0 && marginLeft === 0) {
      return {
        width: `${VALID_LINE_PERCENTAGE}%`,
        marginLeft: '0',
        backgroundColor: palette.expiredLight,
      };
    } else {
      const timelineLength = width - marginLeft;

      if (timelineLength < VALID_LINE_PERCENTAGE) {
        return {
          width: `${width}%`,
          marginLeft: `${marginLeft}%`,
          backgroundColor: palette.expiringLight,
        };
      } else {
        return {
          width: `${width}%`,
          marginLeft: `${marginLeft}%`,
          backgroundColor: palette.validLight,
        };
      }
    }
  };

  const effectivePeriodText = (effectivePeriod: PeriodValidity) =>
    effectivePeriod.timelineStartPosition > 0 &&
    effectivePeriod.from.localeCompare(effectivePeriod.to) !== 0
      ? effectivePeriod.from + ' - ' + effectivePeriod.to
      : effectivePeriod.to;

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        '& + &': { mt: '1px' },
        '&:focus, &:focus-within': { zIndex: 2 },
      }}
    >
      <Typography variant="h5" component="div" sx={{ m: '20px 1px 5px 1px' }}>
        {lineNumber} -{' '}
        {effectivePeriodsForLineNumber.length ? lineNames : 'Ugyldig linje. Mangler data'}
      </Typography>
      {linesValidityListHeader}
      <Box
        component="button"
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        sx={{
          appearance: 'none',
          border: 'none',
          borderRadius: '4px',
          background: '#f5f5f5',
          color: 'inherit',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          m: 0,
          userSelect: 'none',
          width: '100%',
          padding: '1px',
          '&:hover': { opacity: 0.8 },
          '&:focus': { outline: 'none', boxShadow: '0 0 0 2px #0066ff' },
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              background: `linear-gradient(to right, ${palette.expiredLight} 0%, ${palette.expiredLight} ${VALID_LINE_PERCENTAGE}%, #f5f5f5 ${VALID_LINE_PERCENTAGE}%, #f5f5f5 100%)`,
              width: '100%',
              height: '56px',
              display: 'flex',
              borderRadius: '4px',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                background: 'black',
                width: '1px',
                height: '100%',
                position: 'absolute',
                ml: `${VALID_LINE_PERCENTAGE}%`,
              }}
            />
            {effectivePeriodsForLineNumber.map((effectivePeriod, index) => (
              <Typography
                key={`subparagraph${id}${index}`}
                variant="body2"
                component="div"
                title={effectivePeriodText(effectivePeriod)}
                style={getTimelineStyle(index, effectivePeriod)}
                sx={{
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  m: 0,
                }}
              >
                {effectivePeriodText(effectivePeriod)}
              </Typography>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              m: '0 10px 0 11px',
            }}
          >
            <ExpandMoreIcon
              sx={{
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </Box>
        </Box>
      </Box>
      {numberOfDaysHeader}
      <Collapse in={open} id={id} sx={{ overflow: 'auto' }}>
        <Box sx={{ py: 2 }} style={contentStyle}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};
