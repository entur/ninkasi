import { useCallback } from 'react';
import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ConnectedEventDetails } from './components/ConnectedEventDetails';
import { UploadAndValidation } from './components/UploadAndValidation';
import type { Provider, ProviderMap } from './types/provider';

interface Props {
  /**
   * When set, the events view is scoped to a single provider (shows upload UI).
   * When undefined, the view shows all providers' events (no upload UI).
   */
  providerId?: string;
  /** Optional provider object, passed through to EventDetails / EventStepper. */
  provider?: Provider;
  /** Optional provider map (used in the all-providers view to label rows). */
  providers?: ProviderMap;
}

export const EventsView = ({ providerId, provider, providers }: Props) => {
  const routerNavigate = useNavigate();
  const navigate = useCallback(
    (url: string) => {
      routerNavigate(url);
    },
    [routerNavigate]
  );

  // Feature-flag defaults, hard-coded to match ninkasi's existing usage.
  const hideIgnoredExportNetexBlocks = true;
  const hideAntuValidationSteps = false;
  const hideFlexDataImport = false;

  // No horizontal padding here: the tab panel rendering this already applies p: 3.
  return (
    <Stack direction="column" spacing={1.5} sx={{ pt: 1, pb: 2 }}>
      {/* Only when it renders something: UploadAndValidation is null without a
          providerId, and an empty wrapper still takes a Stack spacing slot. */}
      {providerId && (
        <Box>
          <UploadAndValidation providerId={providerId} hideFlexDataImport={hideFlexDataImport} />
        </Box>
      )}
      <Box>
        <ConnectedEventDetails
          providerId={providerId}
          provider={provider}
          providers={providers}
          hideIgnoredExportNetexBlocks={hideIgnoredExportNetexBlocks}
          hideAntuValidationSteps={hideAntuValidationSteps}
          navigate={navigate}
        />
      </Box>
    </Stack>
  );
};

// biome-ignore lint/style/useComponentExportOnlyModules: EventsView above is a component; biome does not resolve the re-export
export default EventsView;
