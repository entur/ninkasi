import { validateUsername } from 'utils/usernameValidation';
import { assert } from 'chai';

describe('validateUsername', () => {
  it('should accept letters, digits, underscore, hyphen and dot', () => {
    assert.isNull(validateUsername('user.No_1-x', true));
  });

  it('should accept the length boundaries', () => {
    assert.isNull(validateUsername('abc', true));
    assert.isNull(validateUsername('a'.repeat(30), true));
  });

  it('should reject usernames shorter than 3 characters once blurred', () => {
    assert.match(validateUsername('ab', true), /at least 3/);
  });

  it('should stay quiet about a half-typed username until blurred', () => {
    assert.isNull(validateUsername('ab', false));
  });

  it('should reject usernames longer than 30 characters while typing', () => {
    assert.match(validateUsername('a'.repeat(31), false), /at most 30 characters \(currently 31\)/);
  });

  it('should reject illegal characters while typing', () => {
    assert.match(validateUsername('user 1', false), /Must only include/);
  });
});
