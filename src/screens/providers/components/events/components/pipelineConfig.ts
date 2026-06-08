import type { Provider } from '../types/provider';

/**
 * Pipeline configuration for import events.
 *
 * Defines which steps appear in the EventStepper for each pipeline type.
 * Order of steps in the array determines display order.
 */

/** Steps for the standard import pipeline. */
export const STANDARD_IMPORT_STEPS = [
  'FILE_TRANSFER',
  'FILE_CLASSIFICATION',
  'FILE_DELIVERY',
  'PREVALIDATION',
  'IMPORT',
  'VALIDATION_LEVEL_1',
  'DATASPACE_TRANSFER',
  'VALIDATION_LEVEL_2',
  'EXPORT_NETEX',
  'EXPORT_NETEX_POSTVALIDATION',
  'EXPORT_NETEX_MERGED_POSTVALIDATION',
  'EXPORT_NETEX_BLOCKS',
  'EXPORT',
  'OTP2_BUILD_GRAPH',
  'EXPORT_NETEX_BLOCKS_POSTVALIDATION',
];

/** Steps for the experimental import pipeline. */
export const EXPERIMENTAL_IMPORT_STEPS = [
  'FILE_TRANSFER',
  'FILE_CLASSIFICATION',
  'FILE_DELIVERY',
  'PREVALIDATION',
  'LINKING',
  'FILTERING',
  'EXPORT_NETEX_POSTVALIDATION',
  'EXPORT_NETEX_MERGED_POSTVALIDATION',
  'EXPORT_NETEX_BLOCKS',
  'EXPORT',
  'OTP2_BUILD_GRAPH',
  'EXPORT_NETEX_BLOCKS_POSTVALIDATION',
];

/** Event groups that should be combined and displayed together. */
export const COMBINED_EVENT_GROUPS: string[][] = [
  ['EXPORT_NETEX_BLOCKS', 'EXPORT', 'OTP2_BUILD_GRAPH'],
];

/** Events related to ANTU validation. */
export const ANTU_VALIDATION_EVENTS = [
  'PREVALIDATION',
  'EXPORT_NETEX_POSTVALIDATION',
  'EXPORT_NETEX_MERGED_POSTVALIDATION',
  'EXPORT_NETEX_BLOCKS_POSTVALIDATION',
];

/** Events related to NeTEx blocks export — can be hidden when IGNORED. */
export const NETEX_BLOCKS_EVENTS = ['EXPORT_NETEX_BLOCKS', 'EXPORT_NETEX_BLOCKS_POSTVALIDATION'];

export function getPipelineSteps(provider: Provider | null | undefined): string[] {
  const isExperimentalImport = provider?.chouetteInfo?.enableExperimentalImport === true;
  return isExperimentalImport ? EXPERIMENTAL_IMPORT_STEPS : STANDARD_IMPORT_STEPS;
}

export function isExperimentalImportEnabled(provider: Provider | null | undefined): boolean {
  return provider?.chouetteInfo?.enableExperimentalImport === true;
}
