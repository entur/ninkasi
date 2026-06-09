/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers';

export default function makeStore() {
  const store = configureStore({
    reducer: rootReducer,
    // RTK's defaults give us thunk + immutability/serializability checks (dev)
    // + Redux DevTools integration. The existing `(dispatch, getState) => …`
    // thunks scattered through `src/actions/` continue to work unchanged;
    // PR-B will rewrite them as `createAsyncThunk`.
  });

  if (import.meta.hot) {
    import.meta.hot.accept('../reducers', async () => {
      const { default: nextRootReducer } = await import('reducers/');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
