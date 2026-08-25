import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

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

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_STORAGE_KEY = 'ninkasi.events.pageSize';

const readStoredPageSize = (): number => {
  try {
    const stored = Number(window.localStorage.getItem(PAGE_SIZE_STORAGE_KEY));
    return PAGE_SIZE_OPTIONS.includes(stored) ? stored : DEFAULT_PAGE_SIZE;
  } catch {
    return DEFAULT_PAGE_SIZE;
  }
};

// Rows are keyed on identity, not list position: the 5s poll replaces the whole
// array, and a position-based key remounts rows and drops expanded state. Some
// rows carry no job id and no filename, and two of those can share a millisecond
// timestamp, so the occurrence counter is what makes the key unique at all.
export const buildRowKeys = (events: TimetableJobEvent[]): string[] => {
  const seen = new Map<string, number>();
  return events.map(event => {
    const base = [
      event.chouetteJobId,
      event.providerId ?? event.provider?.id,
      event.fileName,
      event.firstEvent,
    ].join('-');
    const occurrence = (seen.get(base) ?? 0) + 1;
    seen.set(base, occurrence);
    return `${base}#${occurrence}`;
  });
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
  const [pageSize, setPageSize] = useState(readStoredPageSize);
  const [endStateFilter, setEndStateFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('LAST_WEEK');
  const [onlyNewDeliveryFilter, setOnlyNewDeliveryFilter] = useState(false);

  const filteredSource = useMemo(
    () => filterDataSource(dataSource, dateFilter, endStateFilter, onlyNewDeliveryFilter),
    [dataSource, dateFilter, endStateFilter, onlyNewDeliveryFilter]
  );

  const pageCount = Math.max(1, Math.ceil(filteredSource.length / pageSize));

  // The 5s poll can shrink the list under us; without this the view would fall
  // through to the "no status" empty state while results still exist.
  useEffect(() => {
    setActivePageIndex(current => Math.min(current, pageCount));
  }, [pageCount]);

  const currentPageIndex = Math.min(activePageIndex, pageCount);
  const firstItemIndex = (currentPageIndex - 1) * pageSize;
  const page = filteredSource.slice(firstItemIndex, firstItemIndex + pageSize);
  const rowKeys = buildRowKeys(page);

  const handlePageSizeChange = (nextSize: number) => {
    setPageSize(nextSize);
    // Keep the first currently visible event in view instead of jumping to page 1.
    setActivePageIndex(Math.floor(firstItemIndex / nextSize) + 1);
    try {
      window.localStorage.setItem(PAGE_SIZE_STORAGE_KEY, String(nextSize));
    } catch {
      // Storage unavailable (private mode); page size just won't persist.
    }
  };

  const filters = (
    <Stack
      direction="row"
      spacing={3}
      useFlexGap
      sx={{ alignItems: 'center', flexWrap: 'wrap', mt: 0, mb: 3 }}
    >
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

      <FormControlLabel
        sx={{ mb: 0, mr: 0 }}
        control={
          <Switch
            size="small"
            checked={onlyNewDeliveryFilter}
            onChange={e => {
              setOnlyNewDeliveryFilter(e.target.checked);
              setActivePageIndex(1);
            }}
          />
        }
        label={translations.filter_direct_delivery}
      />
    </Stack>
  );

  const pageSizeSelect = (
    <FormControl size="small" sx={{ mb: 0, minWidth: 120 }}>
      <InputLabel id="events-page-size-label">Per page</InputLabel>
      <Select
        labelId="events-page-size-label"
        label="Per page"
        value={pageSize}
        onChange={event => handlePageSizeChange(Number(event.target.value))}
      >
        {PAGE_SIZE_OPTIONS.map(size => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const paginationControls = (
    <Pagination
      count={pageCount}
      page={currentPageIndex}
      onChange={(_, value) => setActivePageIndex(value)}
      color="primary"
    />
  );

  if (page.length) {
    return (
      <Box>
        {filters}
        {/* 1fr auto 1fr keeps the pager dead centre regardless of how wide the
            count and the page-size select are. */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' },
            alignItems: 'center',
            rowGap: 1,
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {`Showing ${firstItemIndex + 1}–${firstItemIndex + page.length} of ${
              filteredSource.length
            }`}
          </Typography>
          {paginationControls}
          <Box sx={{ justifySelf: { sm: 'end' } }}>{pageSizeSelect}</Box>
        </Box>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mb: 2 }}>
          {page.map((listItem, rowIndex) => {
            const eventGroup: Record<string, { states: typeof listItem.events; endState: string }> =
              {};
            const rowKey = rowKeys[rowIndex];

            listItem.events.forEach(event => {
              if (!eventGroup[event.action]) {
                eventGroup[event.action] = { states: [], endState: event.state };
              }
              eventGroup[event.action].states.push(event);
              eventGroup[event.action].endState = event.state;
            });

            return (
              <Box
                key={`jobstatus-${rowKey}`}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-of-type': { borderBottom: 'none' },
                }}
              >
                <EventStepper
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
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>{paginationControls}</Box>
        )}
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
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: '40px',
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>
          {dataSource && dataSource.length
            ? translations.no_events_matching_filter
            : translations.no_events_at_all}
        </Typography>
      </Box>
    </Box>
  );
};

export default EventDetails;
