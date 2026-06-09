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

import { Box } from '@mui/material';

interface Props {
  username?: string;
  handleLogout: () => void;
}

const NoAccess = ({ username, handleLogout }: Props) => (
  <Box sx={{ padding: '10px', fontSize: 14 }}>
    <Box>
      Your user{' '}
      <Box component="span" sx={{ fontStyle: 'italic' }}>
        {username}{' '}
      </Box>
      has{' '}
      <Box component="span" sx={{ fontWeight: 600 }}>
        {' '}
        not{' '}
      </Box>{' '}
      the necessary authorization to access this application.
    </Box>
    <Box
      sx={{ color: 'blue', marginTop: '10px', cursor: 'pointer' }}
      onClick={() => handleLogout()}
    >
      Log out
    </Box>
  </Box>
);

export default NoAccess;
