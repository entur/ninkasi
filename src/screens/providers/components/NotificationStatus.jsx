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

import React from 'react';
import { HighlightOff, CheckCircle } from '@mui/icons-material';

const NotificationStatus = ({ notification }) => {
  const enumMap = {
    EMAIL: 'Email',
    EMAIL_BATCH: 'Email batch',
    WEB: 'Web'
  };

  return (
    <div style={{ display: 'flex' }}>
      {notification.enabled ? (
        <CheckCircle style={{ color: '#008000', height: 15, width: 15 }} />
      ) : (
        <HighlightOff style={{ color: '#cc0000', height: 15, width: 15 }} />
      )}
      <span style={{ fontWeight: 600, marginLeft: 4 }}>
        {enumMap[notification.notificationType]}
      </span>
    </div>
  );
};

export default NotificationStatus;
