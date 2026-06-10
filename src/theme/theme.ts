import { createTheme, type Theme } from '@mui/material/styles';

/**
 * Entur design tokens (subset). Mirrors the canonical names in @entur/tokens
 * so anyone familiar with the design system can recognize them.
 * Reference: https://linje.entur.no/tokens
 */
export const enturTokens = {
  // Lavender — Entur's primary brand scale. lavender-90 is "Entur blue".
  lavender10: '#f0f1fa',
  lavender20: '#d9ddf2',
  lavender30: '#c7cdeb',
  lavender40: '#aeb7e2',
  lavender50: '#8794d4',
  lavender70: '#3b46ab',
  lavender80: '#262f7d',
  lavender90: '#181c56',
  lavender100: '#11143c',

  // Blue — neutral scale used for subdued text and tinted surfaces.
  blue10: '#f6f6f9',
  blue20: '#eaeaf1',
  blue30: '#d9dae8',
  blue40: '#bcbdd2',
  blue60: '#8284ab',
  blue70: '#626493',
  blue90: '#393d79',

  // Ebony — Entur's dark-mode surface scale. Subtly navy, not pure grey.
  ebony10: '#e5e5e9',
  ebony30: '#b3b4bd',
  ebony50: '#81828f',
  ebony70: '#525360',
  ebony75: '#464755',
  ebony80: '#393a49',
  ebony85: '#2d2e3e',
  ebony90: '#212233',
  ebony95: '#141527',
  ebony100: '#08091c',

  // Grey — pure neutrals.
  grey10: '#f2f5f7',
  grey30: '#e3e6e8',
  grey60: '#949699',
  grey70: '#6e6f73',
  grey80: '#515254',

  // Semantic accent scales.
  sky20: '#acd7f1',
  sky40: '#2d98d2',
  sky50: '#067eb2',
  sky60: '#046690',
  coral20: '#ffcece',
  coral30: '#ff9494',
  coral40: '#ff5959',
  coral60: '#d31b1b',
  mint20: '#d0f1e3',
  mint40: '#5ac39a',
  mint60: '#1a8e60',
  canary20: '#fff4cd',
  canary40: '#ffe082',
  canary60: '#ffca28',
  canary70: '#e9b10c',

  white: '#ffffff',
};

const fontFamily =
  'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

export function createAppTheme(mode: 'light' | 'dark' = 'light'): Theme {
  const isDark = mode === 'dark';

  // Surface + text mappings follow Entur's semantic tokens:
  //   light: frame-default=white, text-accent=lavender-90 (links use brand blue)
  //   dark:  frame-default=ebony-100, text-accent=lavender-40 (links use lavender)
  const surfaces = isDark
    ? {
        bg: enturTokens.ebony100,
        paper: enturTokens.ebony85,
        textPrimary: enturTokens.ebony10,
        textSecondary: enturTokens.ebony30,
        textDisabled: enturTokens.ebony50,
        divider: enturTokens.ebony75,
      }
    : {
        bg: enturTokens.white,
        paper: enturTokens.white,
        textPrimary: enturTokens.ebony100,
        textSecondary: enturTokens.blue70,
        textDisabled: enturTokens.grey60,
        divider: enturTokens.blue30,
      };

  return createTheme({
    palette: {
      mode,
      // Primary swaps between dark/light variants so links and primary actions
      // always have enough contrast against the current background. AppBar
      // keeps brand blue via the MuiAppBar override regardless.
      primary: isDark
        ? {
            main: enturTokens.lavender40,
            light: enturTokens.lavender20,
            dark: enturTokens.lavender90,
            contrastText: enturTokens.ebony100,
          }
        : {
            main: enturTokens.lavender90,
            light: enturTokens.lavender50,
            dark: enturTokens.lavender100,
            contrastText: enturTokens.white,
          },
      secondary: {
        main: enturTokens.lavender40,
        light: enturTokens.lavender20,
        dark: enturTokens.lavender80,
        contrastText: enturTokens.lavender90,
      },
      error: {
        main: enturTokens.coral60,
        light: enturTokens.coral20,
        dark: '#b31414',
        contrastText: enturTokens.white,
      },
      warning: {
        main: enturTokens.canary60,
        light: enturTokens.canary20,
        dark: enturTokens.canary70,
        contrastText: enturTokens.ebony100,
      },
      success: {
        main: enturTokens.mint60,
        light: enturTokens.mint20,
        dark: '#05613e',
        contrastText: enturTokens.white,
      },
      info: {
        main: enturTokens.sky50,
        light: enturTokens.sky20,
        dark: enturTokens.sky60,
        contrastText: enturTokens.white,
      },
      background: { default: surfaces.bg, paper: surfaces.paper },
      text: {
        primary: surfaces.textPrimary,
        secondary: surfaces.textSecondary,
        disabled: surfaces.textDisabled,
      },
      divider: surfaces.divider,
    },
    typography: {
      fontFamily,
      h1: { fontSize: '34px', fontWeight: 600, lineHeight: '42px' },
      h2: { fontSize: '28px', fontWeight: 600, lineHeight: '36px' },
      h3: { fontSize: '22px', fontWeight: 600, lineHeight: '30px' },
      h4: { fontSize: '16px', fontWeight: 600, lineHeight: '24px' },
      h5: { fontSize: '14px', fontWeight: 600, lineHeight: '22px' },
      body1: { fontSize: '16px', fontWeight: 400, lineHeight: '22px' },
      body2: { fontSize: '14px', fontWeight: 400, lineHeight: '22px' },
      subtitle1: { fontSize: '14px', fontWeight: 600, lineHeight: '22px' },
      caption: { fontSize: '12px', fontWeight: 400, lineHeight: '18px' },
    },
    spacing: 8,
    shape: { borderRadius: 4 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', borderRadius: 4 },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
        styleOverrides: {
          root: {
            marginBottom: '16px',
            '& + .MuiTextField-root': { marginTop: '8px' },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            marginBottom: '16px',
            '& + .MuiFormControl-root': { marginTop: '8px' },
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            marginBottom: '8px',
            '&:last-child': { marginBottom: 0 },
          },
          label: { fontSize: '0.9em', marginLeft: '8px' },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          // backgroundImage: 'none' defeats MUI's dark-mode Paper elevation
          // overlay, which would otherwise wash brand blue toward purple/grey.
          root: { backgroundColor: enturTokens.lavender90, backgroundImage: 'none' },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 600 },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: { minHeight: 64 },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: { margin: 0, padding: 0, minHeight: '100vh' },
          '#root': { minHeight: '100vh' },
        },
      },
    },
  });
}

// Default light-mode singleton for code that doesn't care about the factory.
const theme = createAppTheme('light');
export default theme;
