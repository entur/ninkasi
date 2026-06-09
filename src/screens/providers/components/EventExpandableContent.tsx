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

import { Grid as MuiGrid, Typography, Divider } from '@mui/material';
const Grid = MuiGrid as any;

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
    <div className="visible-wrapper">
      <p>Events for {correlationId}</p>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <Typography fontWeight="bold">Action</Typography>
        </Grid>
        <Grid item md={4}>
          <Typography fontWeight="bold">Date</Typography>
        </Grid>
        <Grid item md={4}>
          <Typography fontWeight="bold">State</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />

      {events && events.length ? (
        <div>
          {events.map((event, index) => {
            const stateClass =
              event.state === 'TIMEOUT' || event.state === 'ERROR' || event.state === 'FAILED'
                ? 'error'
                : 'success';
            return (
              <Grid container spacing={2} key={'action-' + index}>
                <Grid item md={4} key={'event-action-' + index}>
                  <Typography>{event.action}</Typography>
                </Grid>
                <Grid item md={4} key={'event-date-' + index}>
                  <Typography>{event.date}</Typography>
                </Grid>
                <Grid item md={4} key={'event-state-' + index}>
                  <Typography>
                    <span className={stateClass}>{event.state}</span>
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
        </div>
      ) : (
        <div>No events found</div>
      )}
    </div>
  );
};

export default EventExpandableContent;
