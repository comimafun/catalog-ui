import { create } from 'zustand';

type DrawerState = {
  drawerFilterStep: 'fandom' | 'work_type' | null;
  drawerFilterIsOpen: boolean;
  searchFandom: string;
};
type DrawerAction = {
  setDrawerFilterStep: (step: DrawerState['drawerFilterStep']) => void;
  setDrawerFilterIsOpen: (open: DrawerState['drawerFilterIsOpen']) => void;
  setSearchFandom: (search: DrawerState['searchFandom']) => void;
  reset: () => void;
};
const drawerInitialState: DrawerState = {
  drawerFilterStep: null,
  drawerFilterIsOpen: false,
  searchFandom: '',
};

export const useDrawerFilterStore = create<DrawerState & DrawerAction>(
  (set) => ({
    ...drawerInitialState,
    setDrawerFilterStep: (step) => set({ drawerFilterStep: step }),
    setDrawerFilterIsOpen: (open) => set({ drawerFilterIsOpen: open }),
    setSearchFandom: (search) => set({ searchFandom: search }),
    reset: () => set(drawerInitialState),
  }),
);
