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

const ExportedFilesHeader = () => {
  const style = {
    padding: '2px',
    border: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    background: 'rgb(47, 47, 47)',
    color: '#fff',
  };

  return (
    <Box sx={style}>
      <Box sx={{ flex: 2.5 }}>Name</Box>
      <Box sx={{ flex: 1 }}>Referential</Box>
      <Box sx={{ flex: 3 }}>Netex exported</Box>
      <Box sx={{ flex: 1 }}>Netex file</Box>
      <Box sx={{ flex: 3 }}>GTFS exported</Box>
      <Box sx={{ flex: 1 }}>GTFS file</Box>
      <Box sx={{ flex: 1 }}>Difference</Box>
      <Box sx={{ flex: 4 }}>Status</Box>
    </Box>
  );
};

export default ExportedFilesHeader;
