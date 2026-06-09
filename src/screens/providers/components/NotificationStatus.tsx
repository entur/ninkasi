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

import { HighlightOff, CheckCircle } from '@mui/icons-material';
import { Box } from '@mui/material';

interface Props {
  notification: {
    enabled: boolean;
    notificationType: string;
  };
}

const NotificationStatus = ({ notification }: Props) => {
  const enumMap: Record<string, string> = {
    EMAIL: 'Email',
    EMAIL_BATCH: 'Email batch',
    WEB: 'Web',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {notification.enabled ? (
        <CheckCircle sx={{ color: 'success.main', height: 15, width: 15 }} />
      ) : (
        <HighlightOff sx={{ color: 'error.main', height: 15, width: 15 }} />
      )}
      <Box component="span" sx={{ fontWeight: 600, marginLeft: '4px' }}>
        {enumMap[notification.notificationType]}
      </Box>
    </Box>
  );
};

export default NotificationStatus;
