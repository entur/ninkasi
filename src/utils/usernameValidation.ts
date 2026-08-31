// Mirrors USERNAME_PATTERN in baba (UserValidator).
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;
const ALLOWED_CHARACTERS = /^[a-zA-Z0-9._-]*$/;

// The too-short message only makes sense once the field is left, hence `blurred`.
export const validateUsername = (username: string, blurred: boolean): string | null => {
  if (!ALLOWED_CHARACTERS.test(username)) {
    return 'Must only include letters, digits, underscore, hyphen and dot';
  }
  if (username.length > MAX_LENGTH) {
    return `Must be at most ${MAX_LENGTH} characters (currently ${username.length})`;
  }
  if (blurred && username && username.length < MIN_LENGTH) {
    return `Must be at least ${MIN_LENGTH} characters`;
  }
  return null;
};
