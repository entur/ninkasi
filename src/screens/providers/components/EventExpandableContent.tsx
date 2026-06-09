/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import { Box, Grid, Typography, Divider } from '@mui/material';

interface EventItem {
  action: string;
  date: string;
  state: string;
}

interface Props {
  events: EventItem[];
  correlationId: string;
}

const EventExpandableContent = ({ events, correlationId }: Props) => {
  return (
    <Box
      sx={{
        bgcolor: 'grey.100',
        p: 1.25,
        border: '1px solid',
        borderColor: 'grey.400',
        m: 1.25,
      }}
    >
      <Typography component="p">Events for {correlationId}</Typography>
      <Grid container spacing={2}>
        <Grid size={{ md: 4 }}>
          <Typography sx={{ fontWeight: 'bold' }}>Action</Typography>
        </Grid>
        <Grid size={{ md: 4 }}>
          <Typography sx={{ fontWeight: 'bold' }}>Date</Typography>
        </Grid>
        <Grid size={{ md: 4 }}>
          <Typography sx={{ fontWeight: 'bold' }}>State</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />

      {events && events.length ? (
        <Box>
          {events.map((event, index) => {
            const isError =
              event.state === 'TIMEOUT' || event.state === 'ERROR' || event.state === 'FAILED';
            return (
              <Grid container spacing={2} key={'action-' + index}>
                <Grid size={{ md: 4 }} key={'event-action-' + index}>
                  <Typography>{event.action}</Typography>
                </Grid>
                <Grid size={{ md: 4 }} key={'event-date-' + index}>
                  <Typography>{event.date}</Typography>
                </Grid>
                <Grid size={{ md: 4 }} key={'event-state-' + index}>
                  <Typography sx={{ color: isError ? 'error.main' : 'success.main' }}>
                    {event.state}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
        </Box>
      ) : (
        <Typography>No events found</Typography>
      )}
    </Box>
  );
};

export default EventExpandableContent;
