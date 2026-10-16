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

export interface GraphBuilderState {
  paused: boolean;
  pausedBy?: string | null;
  pausedAt?: number | null;
  reason?: string | null;
  deferredTransitBuilds: number;
  deferredStreetBuilds: number;
}

export interface GraphProduction {
  serializationId: string;
  currentGraph?: string | null;
  pinned: boolean;
}

export interface GraphPin {
  serializationId: string;
  graph: string;
  pinnedBy: string;
  pinnedAt: number;
  reason: string;
  currentGraph?: string | null;
}

export interface GraphControlAction {
  action: string;
  serializationId?: string | null;
  graph?: string | null;
  performedBy: string;
  performedAt: number;
  reason?: string | null;
}

export interface GraphControlStatus {
  builder: GraphBuilderState;
  production: GraphProduction | null;
  pins: GraphPin[];
  recentActions: GraphControlAction[];
}

export interface GraphVersion {
  graph: string;
  fileName: string;
  timestamp: string;
  creationDate?: number | null;
  size?: number | null;
  current: boolean;
  pinned: boolean;
}

export interface SerializationVersion {
  serializationId: string;
  production: boolean;
  currentGraph?: string | null;
  pinnedGraph?: string | null;
  totalGraphs: number;
  graphs: GraphVersion[];
}

export interface GraphRolloutResult {
  graph: string;
  serializationId: string;
  production: boolean;
  restartTriggered: boolean;
  pinned: boolean;
}

export const MIN_REASON_LENGTH = 5;
export const MAX_REASON_LENGTH = 1000;

export const isReasonValid = (reason: string | null | undefined): boolean => {
  const length = (reason ?? '').trim().length;
  return length >= MIN_REASON_LENGTH && length <= MAX_REASON_LENGTH;
};

const GRAPH_TIMESTAMP = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{3})$/;

/**
 * Formats a graph build timestamp (yyyyMMddHHmmssSSS) as yyyy-MM-dd HH:mm:ss.
 */
export const formatGraphTimestamp = (timestamp: string | null | undefined): string | null => {
  const match = GRAPH_TIMESTAMP.exec(timestamp ?? '');
  if (!match) {
    return null;
  }
  const [, year, month, day, hour, minute, second] = match;
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

/**
 * Parses a graph path (netex-otp2/<serialization id>/<timestamp>-Graph-otp2-<serialization id>.obj).
 */
export const parseGraphPath = (
  graph: string | null | undefined
): { serializationId: string; timestamp: string | null; fileName: string } | null => {
  const elements = (graph ?? '').trim().split('/');
  if (elements.length !== 3 || elements[0] !== 'netex-otp2') {
    return null;
  }
  const fileName = elements[2];
  const timestamp = /^(\d{17})-/.exec(fileName)?.[1] ?? null;
  return { serializationId: elements[1], timestamp, fileName };
};

/**
 * Short human-readable name of a graph: its build time, or its file name.
 */
export const graphLabel = (graph: string | null | undefined): string => {
  if (!graph) {
    return 'none';
  }
  const parsed = parseGraphPath(graph);
  if (!parsed) {
    return graph;
  }
  return formatGraphTimestamp(parsed.timestamp) ?? parsed.fileName;
};

export const formatSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined) {
    return '';
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${unit === 0 ? value : value.toFixed(1)} ${units[unit]}`;
};

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

/**
 * Lines of the banner shown on every page while a graph is pinned or the graph builder is paused.
 */
export const bannerMessages = (status: GraphControlStatus | null | undefined): string[] => {
  if (!status) {
    return [];
  }
  const messages: string[] = [];
  const productionId = status.production?.serializationId;
  [...(status.pins ?? [])]
    .sort(
      (a, b) =>
        Number(b.serializationId === productionId) - Number(a.serializationId === productionId)
    )
    .forEach(pin => {
      const scope =
        pin.serializationId === productionId
          ? 'Production OTP graph'
          : `OTP graph ${pin.serializationId}`;
      messages.push(
        `${scope} pinned to ${graphLabel(pin.graph)} (${pin.serializationId}) by ${pin.pinnedBy}: new builds are not rolled out.`
      );
    });
  if (status.builder?.paused) {
    const waiting = status.builder.deferredTransitBuilds + status.builder.deferredStreetBuilds;
    messages.push(
      `Graph builder paused${status.builder.pausedBy ? ` by ${status.builder.pausedBy}` : ''}: ${plural(waiting, 'build request')} waiting.`
    );
  }
  return messages;
};

export interface RolloutImpact {
  restartsProduction: boolean;
  replacesPin: boolean;
  isCurrent: boolean;
  description: string[];
}

/**
 * What rolling out a graph does, as shown in the confirmation dialog.
 */
export const rolloutImpact = (
  version: SerializationVersion,
  graph: GraphVersion,
  pin: boolean
): RolloutImpact => {
  const label = graphLabel(graph.graph);
  const isCurrent = graph.graph === version.currentGraph;
  const replacesPin = !!version.pinnedGraph && version.pinnedGraph !== graph.graph;
  const description: string[] = [];

  if (version.production) {
    description.push(
      `Production OTP (${version.serializationId}) switches to the graph built ${label}. The OTP instances restart within about a minute.`
    );
    if (isCurrent) {
      description.push('This graph is already current: the OTP instances are restarted anyway.');
    }
  } else {
    description.push(
      `The serialization version ${version.serializationId} is not used in production: its current graph becomes the graph built ${label}, and OTP is not restarted.`
    );
  }

  if (pin) {
    description.push('New builds will not replace it until the graph is unpinned.');
    if (replacesPin) {
      description.push(
        `It replaces the pin on the graph built ${graphLabel(version.pinnedGraph)}.`
      );
    }
  } else {
    description.push('The next successful graph build will replace it.');
    if (version.pinnedGraph) {
      description.push(`The pin on the graph built ${graphLabel(version.pinnedGraph)} is removed.`);
    }
  }

  return {
    restartsProduction: version.production,
    replacesPin,
    isCurrent,
    description,
  };
};

const ACTION_LABELS: Record<string, string> = {
  ROLLOUT: 'Roll out',
  ROLLOUT_AND_PIN: 'Roll out & pin',
  PIN: 'Pin',
  UNPIN: 'Unpin',
  PAUSE: 'Pause builder',
  RESUME: 'Resume builder',
  BUILD_NOT_PROMOTED: 'Build not promoted',
};

export const actionLabel = (action: string): string => ACTION_LABELS[action] ?? action;
