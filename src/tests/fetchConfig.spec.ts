import { afterEach, describe, expect, it, vi } from 'vitest';

describe('fetchConfig', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('fetches config.json from the site root regardless of the current route', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ auth0: {} }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { fetchConfig } = await import('../config/fetchConfig');
    await fetchConfig();

    expect(fetchMock).toHaveBeenCalledWith('/config.json', { cache: 'no-store' });
  });
});
