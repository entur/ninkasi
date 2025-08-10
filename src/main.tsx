import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { startRouteChangeEmitter } from '@entur/micro-frontend';
import './sass/main.scss';
import App from './app/App';
import configureStore from './store/store';
import { fetchConfig } from './config/fetchConfig';
import { ConfigContext } from './contexts/ConfigContext';
import { AuthProvider } from './auth';

// Initialize micro-frontend route change emitter
startRouteChangeEmitter();

// Fetch config and render app
fetchConfig().then(config => {
  // Store config globally for legacy code compatibility
  (window as any).config = config;

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ConfigContext.Provider value={config}>
        <AuthProvider>
          <Provider store={configureStore()}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        </AuthProvider>
      </ConfigContext.Provider>
    </StrictMode>
  );
});
