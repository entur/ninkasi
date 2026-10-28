import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Router from '../app/Router';
import UserContextReducer from '../reducers/UserContextReducer';

vi.mock('screens/providers', () => ({ default: () => <div>providers-screen</div> }));
vi.mock('screens/organization', () => ({ default: () => <div>organization-screen</div> }));
vi.mock('screens/netexValidationReports/ValidationReport', () => ({
  default: () => <div>report-screen</div>,
}));
vi.mock('screens/graphControl/GraphControlPage', () => ({
  default: () => <div>graph-control-screen</div>,
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const renderAt = (path: string, userContext: object) => {
  const store = configureStore({
    reducer: { UserContextReducer },
    preloadedState: {
      UserContextReducer: {
        preferredName: '',
        isRouteDataAdmin: false,
        isOrganisationAdmin: false,
        ...userContext,
      },
    },
  });
  const container = document.createElement('div');
  act(() => {
    createRoot(container).render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <Router />
        </MemoryRouter>
      </Provider>
    );
  });
  return container.textContent;
};

describe('Router access', () => {
  it('redirects org-register-only users from / to permissions', () => {
    expect(renderAt('/', { isOrganisationAdmin: true })).toBe('organization-screen');
  });

  it('keeps org-register-only users out of the pipeline routes', () => {
    expect(renderAt('/timetable-pipeline', { isOrganisationAdmin: true })).toBe(
      'organization-screen'
    );
  });

  it('still gives route data admins the providers screen', () => {
    expect(renderAt('/', { isRouteDataAdmin: true })).toBe('providers-screen');
  });

  it('gives route data admins the OTP graph control screen', () => {
    expect(renderAt('/graph-control', { isRouteDataAdmin: true })).toBe('graph-control-screen');
  });

  it('keeps org-register-only users out of the OTP graph control screen', () => {
    expect(renderAt('/graph-control', { isOrganisationAdmin: true })).toBe('organization-screen');
  });
});
