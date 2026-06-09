import GlobalStyles from '@mui/material/GlobalStyles';

/**
 * Form-layout overrides ported verbatim from the legacy src/sass/components/forms.scss.
 * These target inline `style="display: flex"` wrappers inside DialogContent.
 * Once those flex-row patterns are replaced with <Stack>, this can be deleted.
 */
const AppGlobalStyles = () => (
  <GlobalStyles
    styles={{
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      ".MuiDialogContent-root > div[style*='display: flex']": {
        marginBottom: 16,
        gap: 16,
        '&:last-child': {
          marginBottom: 0,
        },
        '& > *': {
          paddingLeft: '0 !important',
          paddingRight: '0 !important',
        },
      },
    }}
  />
);

export default AppGlobalStyles;
