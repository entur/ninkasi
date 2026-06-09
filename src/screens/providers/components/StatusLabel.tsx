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

import { Warning, Error, CheckCircle } from '@mui/icons-material';
import { ExportStatus } from 'actions/formatUtils';

interface Props {
  type?: string;
  label?: string;
}

const getIcon = (type?: string) => {
  const errorColor = 'red';
  const warningColor = 'orange';
  const successColor = 'green';

  if (type === ExportStatus.ERROR) {
    return <Error style={{ height: 20, width: 20 }} color={errorColor as any} />;
  } else if (type === ExportStatus.WARNING) {
    return <Warning style={{ height: 20, width: 20 }} color={warningColor as any} />;
  } else if (type === ExportStatus.OK) {
    return <CheckCircle style={{ height: 20, width: 20 }} color={successColor as any} />;
  } else {
    return null;
  }
};

const StatusLabel = ({ type, label }: Props) => {
  if (!type) return null;
  const icon = getIcon(type);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {icon}
      <span style={{ marginLeft: 5 }}>{label}</span>
    </div>
  );
};

export default StatusLabel;
