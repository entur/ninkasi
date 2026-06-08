import type { ReactNode } from 'react';
import UdugLink from './UdugLink';

interface ControlledLinkEventState {
  action: string;
  state: string;
  chouetteJobId?: string;
  referential?: string;
}

interface ControlledLinkEvents {
  states?: ControlledLinkEventState[];
}

interface Props {
  events: ControlledLinkEvents;
  navigate: (url: string) => void;
  children: ReactNode;
}

const supportedUdugActions = [
  'PREVALIDATION',
  'EXPORT_NETEX_POSTVALIDATION',
  'EXPORT_NETEX_MERGED_POSTVALIDATION',
  'EXPORT_NETEX_BLOCKS_POSTVALIDATION',
];

const ControlledLink = ({ events, navigate, children }: Props) => {
  if (events.states && events.states.length) {
    const endState = events.states[events.states.length - 1];
    const externalId = endState.chouetteJobId;

    if (
      supportedUdugActions.indexOf(endState.action) > -1 &&
      externalId &&
      endState.state !== 'STARTED' &&
      endState.state !== 'PENDING'
    ) {
      return (
        <UdugLink id={externalId} referential={endState.referential ?? ''} navigate={navigate}>
          {children}
        </UdugLink>
      );
    }
  }

  return <div> {children} </div>;
};

export default ControlledLink;
