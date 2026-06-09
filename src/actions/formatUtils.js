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

import { formatDistanceStrict } from 'date-fns';

export const ExportStatus = Object.freeze({
  OK: 'OK',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
});

const isOfficialNorwegianGTFS = (name = '') => name.indexOf('rb_norway-aggregated-gtfs.zip') > -1;

export const addExportedFileMetadata = (
  providerId,
  referential,
  format,
  file,
  norwayNetex,
  norwayGTFS,
  providerData
) => {
  if (providerId === null) {
    if (format === 'NETEX') {
      norwayNetex.push(file);
    } else if (format === 'GTFS' && isOfficialNorwegianGTFS(file.name)) {
      norwayGTFS.push(file);
    }
    return;
  }

  if (providerData[providerId]) {
    if (providerData[providerId][format]) {
      providerData[providerId][format] = providerData[providerId][format].concat(file);
    } else {
      providerData[providerId][format] = [file];
    }
  } else {
    providerData[providerId] = {
      [format]: [file],
      referential,
    };
  }
};

export const addExportedNorwayMetadata = (norwayNetex, norwayGTFS, providerData) => {
  const GTFS = norwayGTFS
    .sort((a, b) => b.updated - a.updated)
    .filter(file => isOfficialNorwegianGTFS(file.name));
  const NETEX = norwayNetex.sort((a, b) => b.updated - a.updated);
  providerData['ALL'] = {
    NETEX,
    GTFS,
    referential: 'Norway',
  };
};

export const formatProviderData = providerData => {
  const data = Object.assign({}, providerData);
  const comparator = (a, b) => {
    const statusA = a.status.status;
    const statusB = b.status.status;
    const priority = {
      [ExportStatus.OK]: 0,
      [ExportStatus.WARNING]: 1,
      [ExportStatus.ERROR]: 2,
    };

    if (a.referential === 'Norway') return -1;

    return priority[statusA] - priority[statusB];
  };

  return Object.keys(data)
    .map(providerId => (data[providerId] = formatProviderRow(data[providerId])))
    .sort(comparator);
};

const formatProviderRow = providerRow => {
  const { NETEX, GTFS } = providerRow;

  const netexDate = getFirstFromArray(NETEX, 'updated');
  const gtfsDate = getFirstFromArray(GTFS, 'updated');
  const netexFileSize = getFirstFromArray(NETEX, 'fileSize');
  const gtfsFileSize = getFirstFromArray(GTFS, 'fileSize');
  const gtfsUrl = getFirstFromArray(GTFS, 'url');
  const netexUrl = getFirstFromArray(NETEX, 'url');
  const diff =
    netexDate && gtfsDate ? new Date(netexDate).getTime() - new Date(gtfsDate).getTime() : null;
  const diffHumanized =
    netexDate && gtfsDate ? formatDistanceStrict(new Date(netexDate), new Date(gtfsDate)) : null;
  const status = getProviderRowStatus(netexDate, gtfsDate);

  return {
    ...providerRow,
    diff,
    diffHumanized,
    gtfsDate,
    gtfsFileSize,
    gtfsUrl,
    netexDate,
    netexFileSize,
    netexUrl,
    status,
  };
};

const getProviderRowStatus = (netexDate, gtfsDate) => {
  const netexWithin24hours = isWithinLast24Hours(netexDate);
  const gtfsWithin24hours = isWithinLast24Hours(gtfsDate);

  if (gtfsWithin24hours && !netexWithin24hours)
    return {
      status: ExportStatus.WARNING,
      message: 'Netex older than 24h',
    };

  if (!gtfsWithin24hours && !netexWithin24hours)
    return {
      status: ExportStatus.ERROR,
      message: 'Netex and GTFS older than 24h',
    };

  return {
    status: ExportStatus.OK,
    message: 'OK',
  };
};

const getFirstFromArray = (arr, field) => {
  return Array.isArray(arr) && arr[0] && arr[0][field] ? arr[0][field] : null;
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const isWithinLast24Hours = date => {
  if (!date) return false;
  // moment's _data calendar breakdown reported zero years/months/days when
  // the absolute duration was strictly less than 24 hours; preserve that.
  return Math.abs(new Date(date).getTime() - Date.now()) < ONE_DAY_MS;
};
