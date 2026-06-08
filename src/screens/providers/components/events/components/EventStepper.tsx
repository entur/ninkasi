import { useState } from 'react';
import { Box } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
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
import type { TimetableJobEvent, TimetableEvent } from '../types/event';
import type { Provider, ProviderMap } from '../types/provider';

interface EventGroupValue {
  endState: string;
  states?: TimetableEvent[];
  errorOn?: string | null;
  missingBeforeStartStart?: boolean;
}

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

  const provider = selectedProvider || getProviderForImport(providers, listItem);
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
      <Box key={'group-' + group + index} sx={{ display: 'flex', flexDirection: 'row' }}>
        {!isFirst && (
          <Box
            sx={{
              display: 'block',
              borderColor: 'rgb(189, 189, 189)',
              ml: '-6px',
              borderTopStyle: 'solid',
              borderTopWidth: 1,
              width: 30,
              borderRadius: 30,
              m: '8px',
              transform: columnIndex > 0 ? 'translateY(-0.5em) rotate(25deg)' : undefined,
            }}
          />
        )}
        <Box title={toolTipText} sx={{ opacity: event.missingBeforeStartStart ? 0.2 : 1 }}>
          <EventStatusIcon state={event.endState} />
        </Box>
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
        let column: React.ReactNode = null;
        let columnLength = 1;

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

          columnLength = filteredKeys.length;
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
              justifyContent: 'space-between',
              minWidth: 100,
              height: columnLength > 2 ? 40 * columnLength : 45,
            }}
          >
            {column}
          </Box>
        );
      });
  };

  const bullets = renderBullets();

  const showProviderName = providers && !providerId;
  const itemProviderId = listItem.providerId ?? listItem.provider?.id;
  const providerName =
    showProviderName && itemProviderId !== undefined && providers[String(itemProviderId)]
      ? providers[String(itemProviderId)].name
      : null;

  const handleToggle = () => setExpanded(prev => !prev);

  return (
    <Box
      role="button"
      tabIndex={0}
      key={'event' + listItem.chouetteJobId}
      sx={{
        margin: 'auto',
        width: '98%',
        cursor: 'pointer',
        outline: 'none',
      }}
      onClick={handleToggle}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      <Box sx={{ display: 'flex', ml: '-15px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', mr: '20px' }}>
          <Box
            title={format(new Date(listItem.firstEvent), 'PPpp', { locale: enGB })}
            sx={{
              fontSize: '0.9em',
              fontWeight: 600,
              color: '#e59400',
              mt: '-8px',
            }}
          >
            {formatDistanceToNow(new Date(listItem.firstEvent), { locale: enGB })}
          </Box>
          {showProviderName && providerName && (
            <Box sx={{ fontSize: '0.9em', fontWeight: 700, mt: '4px' }}>{providerName}</Box>
          )}
        </Box>
        <Box sx={{ fontSize: '0.9em', fontWeight: 600, flex: 2 }}>
          {listItem.fileName || actionTranslations.filename.undefined}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'flex-start',
          justifyContent: 'center',
          mt: '10px',
        }}
      >
        {bullets}
        <Box component="span" sx={{ ml: 'auto', mr: '20px', mt: '-25px' }} aria-hidden="true">
          {!expanded ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
        </Box>
      </Box>
      {expanded && (
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
              <Box component="span" sx={{ fontWeight: 600, mr: '10px', color: 'red' }}>
                {actionTranslations.errorCode[listItem.errorCode]}
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
      )}
    </Box>
  );
};

export default EventStepper;
