import { useId } from 'react';
import { Box, Typography } from '@mui/material';
import type { PeriodValidity, Timetable } from '../../lineStatistics.types';
import { VALID_LINE_PERCENTAGE } from '../../lineStatistics.constants';

interface Props {
  timetables: Timetable[];
}

export const Timeline = ({ timetables }: Props) => {
  const randomId = useId();

  const getPeriodStyle = (period: PeriodValidity) => ({
    width: `${period.timelineEndPosition - period.timelineStartPosition}%`,
    marginLeft: `${period.timelineStartPosition}%`,
  });

  return (
    <Box sx={{ width: '100%', pr: '37px' }}>
      <Box
        sx={{
          borderRadius: '4px',
          background: '#ded8d8',
          overflowY: 'auto',
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
        {timetables.map((timetable, timeTableIndex) =>
          timetable.periods.map((period, periodIndex) => (
            <Box
              key={`${randomId}-${timeTableIndex}-${periodIndex}`}
              sx={{
                '&:hover': { opacity: 0.9 },
                marginBottom: timeTableIndex === timetables.length - 1 ? '0' : '2px',
              }}
            >
              <Box
                sx={{
                  background: '#6d92b6',
                  width: '100%',
                  height: '25px',
                  color: '#fff',
                  fontWeight: 500,
                  display: 'flex',
                  borderRadius: '4px',
                  ...getPeriodStyle(period as PeriodValidity),
                }}
                title={`${timetable.objectId} \n(period: ${period.from} -> ${period.to})`}
              >
                <Typography
                  variant="caption"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'visible',
                    textShadow: '0 0 5px black',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    m: 'auto 10px',
                    lineHeight: '18px',
                    color: '#fff',
                  }}
                >
                  {timetable.objectId}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};
