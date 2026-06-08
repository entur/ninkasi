import { useMemo, useState } from 'react';
import { Box, FormControlLabel, Pagination, Stack, Switch, Typography } from '@mui/material';

import EventStepper from './EventStepper';
import FilterButtonTray from './FilterButtonTray';
import buttonConfig, { getLastValidDate } from './buttonConfig';
import translations from './translations';
import type { TimetableJobEvent } from '../types/event';
import type { Provider, ProviderMap } from '../types/provider';

interface Props {
  dataSource?: TimetableJobEvent[];
  hideIgnoredExportNetexBlocks?: boolean;
  hideAntuValidationSteps?: boolean;
  navigate: (url: string) => void;
  providers?: ProviderMap;
  providerId?: string;
  provider?: Provider;
}

const PAGE_SIZE = 10;

const getPaginationMap = (statusList: TimetableJobEvent[] = []): TimetableJobEvent[][] => {
  const map: TimetableJobEvent[][] = [];
  if (statusList && statusList.length) {
    for (let i = 0, j = statusList.length; i < j; i += PAGE_SIZE) {
      map.push(statusList.slice(i, i + PAGE_SIZE));
    }
  }
  return map;
};

const filterDataSource = (
  dataSource: TimetableJobEvent[] | undefined,
  dateFilter: string,
  endStateFilter: string,
  onlyNewDeliveryFilter: boolean
): TimetableJobEvent[] => {
  const lastDate = getLastValidDate(dateFilter);

  return (dataSource ?? []).filter(event => {
    const appliedFilter: boolean[] = [];

    if (lastDate) {
      appliedFilter.push(new Date(event.firstEvent) > lastDate);
    }

    const endStateFilterApplied =
      endStateFilter === 'FAILED' || endStateFilter === 'OK' || endStateFilter === 'CANCELLED';
    if (endStateFilterApplied) {
      appliedFilter.push(event.endState === endStateFilter);
    }

    const containsEvents = Array.isArray(event.events) && event.events.length;
    if (containsEvents && onlyNewDeliveryFilter) {
      appliedFilter.push(event.events[0].action === 'FILE_TRANSFER');
    }

    return appliedFilter.every(filter => filter);
  });
};

const EventDetails = ({
  dataSource,
  hideIgnoredExportNetexBlocks = true,
  hideAntuValidationSteps = true,
  navigate,
  providers,
  providerId,
  provider,
}: Props) => {
  const [activePageIndex, setActivePageIndex] = useState(1);
  const [endStateFilter, setEndStateFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('LAST_WEEK');
  const [onlyNewDeliveryFilter, setOnlyNewDeliveryFilter] = useState(false);

  const filteredSource = useMemo(
    () => filterDataSource(dataSource, dateFilter, endStateFilter, onlyNewDeliveryFilter),
    [dataSource, dateFilter, endStateFilter, onlyNewDeliveryFilter]
  );

  const paginationMap = useMemo(() => getPaginationMap(filteredSource), [filteredSource]);
  const page = paginationMap[activePageIndex - 1];

  const filters = (
    <Stack direction="column">
      <FilterButtonTray
        label="Status"
        activeButtonId={endStateFilter}
        onChange={selectedItem => {
          setEndStateFilter(selectedItem);
          setActivePageIndex(1);
        }}
        buttonConfig={{
          fields: [{ id: 'ALL' }, { id: 'OK' }, { id: 'CANCELLED' }, { id: 'FAILED' }],
        }}
        translationKey="states"
      />

      <FilterButtonTray
        label="Uploaded"
        activeButtonId={dateFilter}
        onChange={selected => {
          setDateFilter(selected);
          setActivePageIndex(1);
        }}
        buttonConfig={buttonConfig}
        translationKey="filterButton"
      />

      <Box sx={{ ml: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={onlyNewDeliveryFilter}
              onChange={e => {
                setOnlyNewDeliveryFilter(e.target.checked);
                setActivePageIndex(1);
              }}
            />
          }
          label={translations.filter_direct_delivery}
        />
      </Box>
    </Stack>
  );

  if (page && page.length && paginationMap) {
    return (
      <Box>
        <Box sx={{ width: '100%', mb: '2rem' }}>{filters}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Pagination
            count={Math.ceil(filteredSource.length / PAGE_SIZE)}
            page={activePageIndex}
            onChange={(_, value) => setActivePageIndex(value)}
            color="primary"
          />
        </Box>
        <Box>
          {page.map((listItem, index) => {
            const eventGroup: Record<string, { states: typeof listItem.events; endState: string }> =
              {};

            listItem.events.forEach(event => {
              if (!eventGroup[event.action]) {
                eventGroup[event.action] = { states: [], endState: event.state };
              }
              eventGroup[event.action].states.push(event);
              eventGroup[event.action].endState = event.state;
            });

            return (
              <Box
                key={'jobstatus-' + listItem.chouetteJobId + '-' + index}
                sx={{
                  mb: '20px',
                  border: '1px solid #eee',
                  p: '10px',
                  overflowY: 'auto',
                  height: '100%',
                }}
              >
                <EventStepper
                  key={'event-group-' + listItem.chouetteJobId + '-' + index}
                  groups={eventGroup}
                  listItem={listItem}
                  hideIgnoredExportNetexBlocks={hideIgnoredExportNetexBlocks}
                  hideAntuValidationSteps={hideAntuValidationSteps}
                  navigate={navigate}
                  providers={providers}
                  providerId={providerId}
                  selectedProvider={provider}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', textAlign: 'left', mb: '5px' }}>
      {filters}
      <Box
        sx={{
          mb: '20px',
          mt: '20px',
          border: '1px solid #eee',
          p: '40px',
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>{translations.no_status}</Typography>
      </Box>
    </Box>
  );
};

export default EventDetails;
