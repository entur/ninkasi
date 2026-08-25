import { useState } from 'react';
import { Box, Button, Collapse, Popover, Tooltip } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatDistanceToNow, format, formatDuration } from 'date-fns';
import { enGB } from 'date-fns/locale';
import * as duration from 'duration-fns';

import actionTranslations from './actionTranslations';
import translations from './translations';
import ControlledLink from './ControlledLink';
import EventStatusIcon from './EventStatusIcon';
import {
  getPipelineSteps,
  COMBINED_EVENT_GROUPS,
  ANTU_VALIDATION_EVENTS,
  NETEX_BLOCKS_EVENTS,
} from './pipelineConfig';
import { useSelectProvider } from '../hooks/useSelectProvider';
import type { TimetableJobEvent, TimetableEvent } from '../types/event';
import type { Provider, ProviderMap } from '../types/provider';

interface EventGroupValue {
  endState: string;
  states?: TimetableEvent[];
  errorOn?: string | null;
  missingBeforeStartStart?: boolean;
}

const TIME_COLUMN_WIDTH = 100;
const PROVIDER_COLUMN_WIDTH = 185;

// Truncate rather than wrap: a value that wraps makes one row taller than its
// neighbours, which is the ragged alignment the fixed column width prevents.
const truncate = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
} as const;

const providerNameSx = {
  fontSize: '0.9em',
  fontWeight: 700,
  width: PROVIDER_COLUMN_WIDTH,
  flexShrink: 0,
  ...truncate,
} as const;

const buttonReset = {
  fontFamily: 'inherit',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
  p: 0,
  m: 0,
  border: 0,
  bgcolor: 'transparent',
  color: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
} as const;

type EventGroups = Record<string, EventGroupValue>;
type FormattedGroups = Record<string, EventGroupValue | EventGroups>;

interface Props {
  groups: EventGroups;
  listItem: TimetableJobEvent;
  hideIgnoredExportNetexBlocks?: boolean;
  hideAntuValidationSteps?: boolean;
  navigate: (url: string) => void;
  providers?: ProviderMap;
  providerId?: string;
  selectedProvider?: Provider;
}

const getProviderForImport = (
  providers: ProviderMap | undefined,
  listItem: TimetableJobEvent
): Provider | null => {
  const itemProviderId = listItem.providerId ?? listItem.provider?.id;
  if (!providers || itemProviderId === undefined) return null;
  return providers[String(itemProviderId)] ?? null;
};

const addUnlistedStates = (groups: EventGroups, pipelineSteps: string[]): EventGroups => {
  const groupsWithUnlisted: EventGroups = { ...groups };
  let firstStateFound = false;

  pipelineSteps.forEach(state => {
    if (!groupsWithUnlisted[state]) {
      groupsWithUnlisted[state] = {
        endState: 'IGNORED',
        missingBeforeStartStart: !firstStateFound,
      };
    } else {
      firstStateFound = true;
    }
  });

  const finalGroups: EventGroups = {};
  Object.keys(groupsWithUnlisted)
    .sort((key1, key2) => pipelineSteps.indexOf(key1) - pipelineSteps.indexOf(key2))
    .forEach(key => {
      finalGroups[key] = groupsWithUnlisted[key];
    });
  return finalGroups;
};

const createCombinedSplit = (
  formattedGroups: FormattedGroups,
  combineGroupNames: string[],
  name: string
) => {
  const combined: EventGroups = {};
  for (const group of combineGroupNames) {
    const value = formattedGroups[group];
    if (value && !Array.isArray(value) && 'endState' in value) {
      combined[group] = value as EventGroupValue;
    }
    if (name !== group) {
      delete formattedGroups[group];
    }
  }
  formattedGroups[name] = combined;
};

const aggregateFileEvents = (data: EventGroups): EventGroups => {
  const groups: EventGroups = { ...data };
  let endState: string | null = null;
  let errorOn: string | null = null;

  Object.keys(groups).forEach(group => {
    if (group === 'FILE_CLASSIFICATION' || group === 'FILE_TRANSFER') {
      endState = groups[group].endState;
      if (endState === 'FAILED' || endState === 'DUPLICATE') {
        errorOn = group;
      }
      delete groups[group];
    }
  });

  if (endState !== null) {
    groups.FILE_DELIVERY = {
      endState: errorOn ? 'FAILED' : endState,
      errorOn,
      missingBeforeStartStart: endState === 'IGNORED' && !errorOn,
    };
  }
  return groups;
};

const isCombinedGroup = (value: EventGroupValue | EventGroups): value is EventGroups => {
  // A combined group is a plain object whose values are EventGroupValue (have endState).
  // A single EventGroupValue has `endState` at the top level.
  return !('endState' in value);
};

const EventStepper = ({
  groups,
  listItem,
  hideIgnoredExportNetexBlocks = true,
  hideAntuValidationSteps = true,
  navigate,
  providers,
  providerId,
  selectedProvider,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [providerAnchor, setProviderAnchor] = useState<HTMLElement | null>(null);
  const selectProvider = useSelectProvider();

  const itemProvider = getProviderForImport(providers, listItem);
  const provider = selectedProvider || itemProvider;
  const pipelineSteps = getPipelineSteps(provider);

  let formattedGroups: FormattedGroups = addUnlistedStates(groups, pipelineSteps);
  formattedGroups = aggregateFileEvents(formattedGroups as EventGroups);

  COMBINED_EVENT_GROUPS.forEach(groupList => {
    const groupName = groupList[groupList.length - 1];
    createCombinedSplit(formattedGroups, groupList, groupName);
  });

  const renderEvent = (
    event: EventGroupValue,
    siblingGroups: EventGroups | FormattedGroups,
    group: string,
    index: number,
    isFirst: boolean,
    columnIndex = 0
  ) => {
    if (!actionTranslations.states[event.endState]) return null;

    let toolTipText = actionTranslations.states[event.endState];

    const siblingGroup = (siblingGroups as Record<string, EventGroupValue | undefined>)[group];
    if (
      event.states &&
      siblingGroup &&
      'states' in siblingGroup &&
      siblingGroup.states &&
      event.states[siblingGroup.states.length - 1]
    ) {
      toolTipText +=
        ' ' +
        format(new Date(event.states[event.states.length - 1].date), 'Pp', {
          locale: enGB,
        });
    }

    if (event.errorOn) {
      toolTipText = actionTranslations.errorMessage[event.errorOn] ?? toolTipText;
    }

    return (
      <Box
        key={'group-' + group + index}
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        {!isFirst && (
          <Box
            sx={{
              display: 'block',
              borderColor: 'divider',
              ml: '-6px',
              borderTopStyle: 'solid',
              borderTopWidth: 1,
              width: 18,
              borderRadius: 30,
              m: '6px',
              flexShrink: 0,
              transform: columnIndex > 0 ? 'translateY(-0.5em) rotate(25deg)' : undefined,
            }}
          />
        )}
        <Tooltip title={toolTipText}>
          <Box sx={{ opacity: event.missingBeforeStartStart ? 0.2 : 1 }}>
            <EventStatusIcon state={event.endState} />
          </Box>
        </Tooltip>
        <Box
          sx={{
            fontSize: '0.9em',
            ml: '5px',
            opacity: event.missingBeforeStartStart ? 0.2 : 1,
          }}
        >
          <ControlledLink events={event as { states?: TimetableEvent[] }} navigate={navigate}>
            {actionTranslations.text[group]}
          </ControlledLink>
        </Box>
      </Box>
    );
  };

  const renderBullets = () => {
    return Object.keys(formattedGroups)
      .filter(key => key !== 'BUILD_GRAPH')
      .filter(key => {
        const event = formattedGroups[key];
        if (isCombinedGroup(event)) {
          return Object.keys(event).some(subKey => pipelineSteps.includes(subKey));
        }
        return pipelineSteps.includes(key);
      })
      .map((group, index) => {
        const event = formattedGroups[group];
        let column: React.ReactNode;

        if (isCombinedGroup(event)) {
          const filteredKeys = Object.keys(event)
            .filter(key => pipelineSteps.includes(key))
            .filter(key => {
              if (hideIgnoredExportNetexBlocks && NETEX_BLOCKS_EVENTS.includes(key)) {
                return event[key].endState !== 'IGNORED';
              }
              if (hideAntuValidationSteps && ANTU_VALIDATION_EVENTS.includes(key)) {
                return false;
              }
              if (ANTU_VALIDATION_EVENTS.includes(key)) {
                return event[key].endState !== 'IGNORED';
              }
              return true;
            });

          column = filteredKeys.map((key, i) => renderEvent(event[key], event, key, i, false, i));
        } else {
          if (
            hideIgnoredExportNetexBlocks &&
            NETEX_BLOCKS_EVENTS.includes(group) &&
            event.endState === 'IGNORED'
          ) {
            return null;
          }
          if (hideAntuValidationSteps && ANTU_VALIDATION_EVENTS.includes(group)) {
            return null;
          }
          if (ANTU_VALIDATION_EVENTS.includes(group) && event.endState === 'IGNORED') {
            return null;
          }
          column = renderEvent(event, groups, group, index, index === 0, 0);
        }

        return (
          <Box
            key={'bullet-' + index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: 0.5,
              // No fixed height: a hard height was what overflowed the row and
              // produced the old per-row scrollbar. Columns compress to minWidth
              // and let labels wrap, so a row stays narrow; once even minWidth
              // doesn't fit, the steps run off to the right rather than stacking.
              minWidth: 88,
            }}
          >
            {column}
          </Box>
        );
      });
  };

  const bullets = renderBullets();

  const showProviderName = Boolean(providers) && !providerId;
  const selectableProvider = showProviderName ? itemProvider : null;

  const handleToggle = () => setExpanded(prev => !prev);

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-label={`${listItem.fileName || actionTranslations.filename.undefined}: import details`}
      sx={{
        width: '100%',
        py: 1,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
        '&:focus': { outline: 'none' },
        '&:focus-visible': {
          outline: theme => `2px solid ${theme.palette.primary.main}`,
          outlineOffset: -2,
        },
      }}
      onClick={handleToggle}
      onKeyDown={e => {
        // Keys from nested controls must keep their own activation: preventDefault
        // here would cancel the click the browser fires for them.
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      {/* Time, provider and filename are fixed-width columns on one line: each row
          is its own flex container, so auto-sized columns ragged-edge the list, and
          stacking the provider under the time cost a whole extra line per row. */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={format(new Date(listItem.firstEvent), 'PPpp', { locale: enGB })}>
          <Box
            sx={{
              fontSize: '0.9em',
              fontWeight: 600,
              color: 'text.secondary',
              width: TIME_COLUMN_WIDTH,
              flexShrink: 0,
              ...truncate,
            }}
          >
            {formatDistanceToNow(new Date(listItem.firstEvent), { locale: enGB })}
          </Box>
        </Tooltip>
        {showProviderName &&
          (selectableProvider ? (
            <>
              <Tooltip title={selectableProvider.name}>
                <Box
                  component="button"
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    setProviderAnchor(event.currentTarget);
                  }}
                  sx={{
                    ...buttonReset,
                    ...providerNameSx,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {selectableProvider.name}
                </Box>
              </Tooltip>
              <Popover
                open={Boolean(providerAnchor)}
                anchorEl={providerAnchor}
                onClose={() => setProviderAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                // Portalled content bubbles up the React tree, so without these the
                // row underneath would react to clicks and keys inside the popover.
                onClick={event => event.stopPropagation()}
                onKeyDown={event => event.stopPropagation()}
              >
                <Button
                  size="small"
                  onClick={() => {
                    setProviderAnchor(null);
                    selectProvider(selectableProvider.id);
                  }}
                  sx={{ m: 0.5, textTransform: 'none' }}
                >
                  {`Show only ${selectableProvider.name}`}
                </Button>
              </Popover>
            </>
          ) : (
            <Box sx={providerNameSx} />
          ))}
        <Box sx={{ fontSize: '0.9em', fontWeight: 600, flex: 1, overflowWrap: 'anywhere' }}>
          {listItem.fileName || actionTranslations.filename.undefined}
        </Box>
        <Box component="span" sx={{ display: 'flex', flexShrink: 0 }} aria-hidden="true">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Box>
      {/* Steps stay on one line and run past the right margin when the pipeline
          is long, rather than wrapping. */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          mt: '6px',
        }}
      >
        {bullets}
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            p: 1,
            flexDirection: 'column',
            mt: '10px',
            cursor: 'default',
          }}
          onClick={event => event.stopPropagation()}
        >
          {listItem.errorCode && (
            <Box>
              <Box component="span" sx={{ fontWeight: 600, mr: '10px', color: 'error.main' }}>
                {actionTranslations.errorCode[listItem.errorCode] ?? listItem.errorCode}
              </Box>
            </Box>
          )}
          <Box>
            <Box component="span" sx={{ fontWeight: 600, mr: '10px' }}>
              {translations.started}
            </Box>
            {format(new Date(listItem.firstEvent), 'PPpp', { locale: enGB })}
          </Box>
          <Box>
            <Box component="span" sx={{ fontWeight: 600, mr: '10px' }}>
              {translations.ended}
            </Box>
            {format(new Date(listItem.lastEvent), 'PPpp', { locale: enGB })}
          </Box>
          <Box>
            <Box component="span" sx={{ fontWeight: 600, mr: '10px' }}>
              {translations.duration}
            </Box>
            {formatDuration(duration.normalize({ milliseconds: listItem.durationMillis }), {
              locale: enGB,
            })}
          </Box>
          <Box>
            <Box component="span" sx={{ fontWeight: 600, mr: '10px' }}>
              {translations.username}
            </Box>
            {listItem.username}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EventStepper;
