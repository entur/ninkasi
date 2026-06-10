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

import { format } from 'date-fns';
import { Box } from '@mui/material';
import { getSizeFromBytes } from '@/utils';
import StatusLabel from './StatusLabel';
import { FileDownload } from '@mui/icons-material';
import { ExportStatus } from 'actions/formatUtils';

interface RowStatus {
  status: string;
  message: string;
}

interface Props {
  data: any;
  index: number;
  referential: string;
  providerName: string;
}

const getStatusLabel = (rowStatus: RowStatus | undefined, index: number) => {
  const backgrounds: Record<string, string> = {
    [ExportStatus.ERROR]: 'rgba(255, 0, 0, 0.2)',
    [ExportStatus.WARNING]: 'hsla(39, 100%, 50%, 0.21)',
    [ExportStatus.OK]: index % 2 ? '#fff' : 'rgba(238, 238, 238, 0.36)',
  };

  if (!rowStatus)
    return {
      background: backgrounds[ExportStatus.OK],
      label: null,
    };

  const { status, message } = rowStatus;

  return {
    label: <StatusLabel type={status} label={message} />,
    background: backgrounds[status],
  };
};

const ExportedFilesRow = ({ data, index, referential, providerName }: Props) => {
  const {
    netexDate,
    gtfsDate,
    netexFileSize,
    netexUrl,
    gtfsUrl,
    diffHumanized,
    gtfsFileSize,
    status,
  } = data;

  const { background, label } = getStatusLabel(status, index);

  const norwayDisplayName = 'Norway';
  const isAggregatedSet = referential === norwayDisplayName;

  const style = {
    padding: '2px',
    border: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    background,
  };

  const missingStyle = {
    fontStyle: 'italic',
  };

  return (
    <Box sx={style}>
      <Box sx={{ flex: 2.5 }}>{isAggregatedSet ? norwayDisplayName : providerName}</Box>
      <Box sx={{ flex: 1 }}>{data.referential || referential}</Box>
      <Box
        sx={{
          flex: 3,
          fontStyle: !netexDate ? missingStyle.fontStyle : 'initial',
        }}
      >
        {netexDate ? format(new Date(netexDate), 'PPPPp') : 'NO EXPORT'}
      </Box>
      <Box sx={{ flex: 1 }}>
        {netexFileSize && (
          <Box
            component="a"
            sx={{ display: 'flex', alignItems: 'center' }}
            href={netexUrl}
            download={true}
          >
            <FileDownload color={'#2196F3' as any} />
            <Box
              component="span"
              sx={{ marginLeft: '2px' }}
            >{`[${getSizeFromBytes(netexFileSize)}]`}</Box>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          flex: 3,
          fontStyle: !gtfsDate ? missingStyle.fontStyle : 'initial',
        }}
      >
        {gtfsDate ? format(new Date(gtfsDate), 'PPPPp') : 'NO EXPORT'}
      </Box>
      <Box sx={{ flex: 1 }}>
        {gtfsFileSize && (
          <Box
            component="a"
            sx={{ display: 'flex', alignItems: 'center' }}
            href={gtfsUrl}
            download={true}
          >
            <FileDownload color={'#2196F3' as any} />
            <Box
              component="span"
              sx={{ marginLeft: '2px' }}
            >{`[${getSizeFromBytes(gtfsFileSize)}]`}</Box>
          </Box>
        )}
      </Box>
      <Box sx={{ flex: 1 }}>{diffHumanized}</Box>
      <Box sx={{ flex: 4 }}>{label}</Box>
    </Box>
  );
};

export default ExportedFilesRow;
