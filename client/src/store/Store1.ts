import { createContext, useContext } from 'react';
import Store from './store';

const store = new Store();

const StoreContext = createContext({ store });

export const useStore = () => useContext(StoreContext);