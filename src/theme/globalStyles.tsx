import GlobalStyles from '@mui/material/GlobalStyles';

/**
 * Global CSS reset. Previously also carried a brittle
 * .MuiDialogContent-root > div[style*="display: flex"] gap rule from the
 * legacy SCSS — removed after dialogs were migrated to sx (the attribute
 * selector no longer matches anything), with per-row gap moved onto
 * `rowSx` / Stack directly.
 */
const AppGlobalStyles = () => (
  <GlobalStyles
    styles={{
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
    }}
  />
);

export default AppGlobalStyles;
