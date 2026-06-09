import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './sass/main.scss';
import App from './app/App';
import makeStore from './store/store';
import { fetchConfig } from './config/fetchConfig';
import { ConfigContext } from './contexts/ConfigContext';
import { AuthProvider, fetchAndCacheLocalDevToken } from './auth';

// Fetch config and render app
fetchConfig().then(async config => {
  // Store config globally for legacy code compatibility
  (window as any).config = config;

  if (config.defaultAuthMethod === 'local' && config.mockOauth2TokenUrl) {
    try {
      await fetchAndCacheLocalDevToken(config.mockOauth2TokenUrl);
    } catch (err) {
      console.error('Failed to fetch local dev token from mock-oauth2:', err);
    }
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ConfigContext.Provider value={config}>
        <AuthProvider>
          <Provider store={makeStore()}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        </AuthProvider>
      </ConfigContext.Provider>
    </StrictMode>
  );
});
