import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import makeStore from './store';

type StoreInstance = ReturnType<typeof makeStore>;
export type RootState = ReturnType<StoreInstance['getState']>;
export type AppDispatch = StoreInstance['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
