/**
 * English-only action / pipeline-step translations.
 * The original zagmuk source kept a locale map; we dropped it.
 */

export interface ActionTranslations {
  text: Record<string, string>;
  title: Record<string, string>;
  filename: Record<string, string>;
  states: Record<string, string>;
  errorMessage: Record<string, string>;
  errorCode: Record<string, string>;
  filterButton: Record<string, string>;
}

const translations: ActionTranslations = {
  text: {
    FILE_TRANSFER: 'File transfer',
    FILE_CLASSIFICATION: 'File classification',
    FILE_DELIVERY: 'File delivery',
    PREVALIDATION: 'Pre-validation',
    LINKING: 'Linking',
    FILTERING: 'Filtering',
    IMPORT: 'Import',
    EXPORT: 'GTFS export',
    EXPORT_NETEX: 'NeTEx export',
    VALIDATION_LEVEL_1: 'Validation level 1',
    DATASPACE_TRANSFER: 'Transfer to central space',
    VALIDATION_LEVEL_2: 'Validation level 2',
    EXPORT_NETEX_POSTVALIDATION: 'Post-validation',
    EXPORT_NETEX_MERGED_POSTVALIDATION: 'Merged dataset validation',
    OTP2_BUILD_GRAPH: 'Build graph',
    EXPORT_NETEX_BLOCKS: 'Export NeTEx blocks',
    EXPORT_NETEX_BLOCKS_POSTVALIDATION: 'NeTEx blocks post-validation',
    UNKNOWN: 'Unknown step',
  },
  title: {
    FILE_TRANSFER: 'Upload local file to remote server',
    LINKING: 'Enrichment of NeTEx data with service links',
    FILTERING: 'Data filtering in the new import process',
    IMPORT: 'File validation and import in local data space - level 1',
    EXPORT: 'Export of route data ',
    VALIDATION_LEVEL_1: 'Validation of complete data space - level 1',
    VALIDATION_LEVEL_2: 'Validation of complete data space - level 2',
    DATASPACE_TRANSFER: 'Transfer to central dataspace - level 2',
    OTP2_BUILD_GRAPH: 'Build graph (otp2)',
    EXPORT_NETEX_BLOCKS: 'Export NeTEx blocks',
    UNKNOWN: 'This step is unknown',
  },
  filename: {
    undefined: 'Validation',
  },
  states: {
    ALL: 'All',
    OK: 'Completed',
    PENDING: 'Pending',
    STARTED: 'Started',
    FAILED: 'Failed',
    DUPLICATE: 'Failed - duplicate data set',
    IGNORED: 'Skipped',
    CANCELLED: 'Cancelled',
    TIMEOUT: 'Timeout',
  },
  errorMessage: {
    FILE_TRANSFER: 'Failed to transfer file',
    FILE_CLASSIFICATION: 'Failed on file classification',
  },
  errorCode: {
    ERROR_FILE_UNKNOWN_FILE_EXTENSION: 'The file extension is neither .zip nor .ZIP',
    ERROR_FILE_NOT_A_ZIP_FILE: 'The file is not a zip archive',
    ERROR_FILE_UNKNOWN_FILE_TYPE: 'The file is neither a NeTEx archive nor a GTFS archive',
    ERROR_FILE_ZIP_CONTAINS_SUB_DIRECTORIES: 'The archive contains sub-directories',
    ERROR_FILE_INVALID_ZIP_ENTRY_ENCODING:
      'The archive contains file names that are not UTF8-encoded',
    ERROR_FILE_INVALID_XML_ENCODING_ERROR:
      'The archive contains XML files with an invalid encoding',
    ERROR_FILE_INVALID_XML_CONTENT: 'The archive contains invalid XML files',
    ERROR_FILE_DUPLICATE: 'The same file has been already imported',
    ERROR_NETEX_EXPORT_EMPTY_EXPORT:
      'The exported dataset is empty (no active timetable data found)',
    ERROR_VALIDATION_NO_DATA:
      'There is no data to validate. Check the status of the latest data import',
  },
  filterButton: {
    ALL_TIME: 'Unlimited',
    LAST_12_HOURS: 'Last 12 hours',
    LAST_24_HOURS: 'Last 24 hours',
    LAST_WEEK: 'Last week',
    LAST_MONTH: 'Last month',
  },
};

export default translations;
