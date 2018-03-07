import moment from 'moment';

export const ExportStatus = Object.freeze({
  OK: 'OK',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
});


const isOfficialNorwegianGTFS = (name = '') => (
  name.indexOf('rb_norway-aggregated-gtfs.zip') > -1
);

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
      providerData[providerId][format] = providerData[providerId][
        format
      ].concat(file);
    } else {
      providerData[providerId][format] = [file];
    }
  } else {
    providerData[providerId] = {
      [format]: [file],
      referential
    };
  }
};

export const addExportedNorwayMetadata = (norwayNetex, norwayGTFS, providerData) => {
  const GTFS = norwayGTFS.sort((a, b) => b.updated - a.updated).filter(file => isOfficialNorwegianGTFS(file.name));
  const NETEX = norwayNetex.sort((a, b) => b.updated - a.updated);
  providerData['ALL'] = {
    NETEX,
    GTFS,
    referential: 'Norway'
  };
};

export const formatProviderData = providerData => {
  const data = Object.assign({}, providerData);
  const comparator = ((a,b) => {
    const statusA = a.status.status;
    const statusB = b.status.status;
    const priority = {
      [ExportStatus.OK]: 0,
      [ExportStatus.WARNING]: 1,
      [ExportStatus.ERROR]: 2,
    };

    if (a.referential === 'Norway') return -1;

    return priority[statusA] - priority[statusB];
  });

  return Object.keys(data).map(
    providerId => (data[providerId] = formatProviderRow(data[providerId]))
  ).sort(comparator);
};

const formatProviderRow = providerRow => {
  const { NETEX, GTFS } = providerRow;

  const netexDate = getFirstFromArray(NETEX, 'updated');
  const gtfsDate = getFirstFromArray(GTFS, 'updated');
  const netexFileSize = getFirstFromArray(NETEX, 'fileSize');
  const gtfsFileSize = getFirstFromArray(GTFS, 'fileSize');
  const gtfsUrl = getFirstFromArray(GTFS, 'url');
  const netexUrl = getFirstFromArray(NETEX, 'url');
  const diff = netexDate && gtfsDate
    ? moment.duration(moment(netexDate).diff(moment(gtfsDate)))
    : null;
  const diffHumanized = diff ? diff.humanize() : null;
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
    status
  };
};

const getProviderRowStatus = (netexDate, gtfsDate) => {
  const netexWithin24hours = isWithinLast24Hours(netexDate);
  const gtfsWithin24hours = isWithinLast24Hours(gtfsDate);

  if (gtfsWithin24hours && !netexWithin24hours) return ({
    status: ExportStatus.WARNING,
    message: 'Netex older than 24h'
  });

  if (!gtfsWithin24hours && !netexWithin24hours) return ({
    status: ExportStatus.ERROR,
    message: 'Netex and GTFS older than 24h'
  });

  return ({
    status: ExportStatus.OK,
    message: 'OK'
  });
};

const getFirstFromArray = (arr, field) => {
  return Array.isArray(arr) && arr[0] && arr[0][field] ? arr[0][field] : null;
};

const isWithinLast24Hours = (date) => {
  const now = Date.now();
  const momentDiff = moment.duration(moment(date).diff(moment(now)));
  if (momentDiff && momentDiff._data) {
    const { years, months, days } = momentDiff._data;
    if (Math.abs(years) === 0 && Math.abs(months) === 0 && Math.abs(days) === 0) {
      return true;
    }
  }
  return false;
};