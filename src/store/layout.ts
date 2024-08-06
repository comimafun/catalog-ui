import { CommonStoreSetter } from '@/types/common';
import { create } from 'zustand';

type LayoutStore = {
  openMenuDrawer: boolean;
};
type LayoutStoreAction = CommonStoreSetter<LayoutStore> & {
  toggleMenuDrawer: () => void;
  reset: () => void;
};
const LayoutInitialState = {
  openMenuDrawer: false,
} as const;
export const useLayoutStore = create<LayoutStore & LayoutStoreAction>(
  (set) => ({
    ...LayoutInitialState,
    setOpenMenuDrawer: (open) => set({ openMenuDrawer: open }),
    toggleMenuDrawer: () =>
      set((state) => {
        return { openMenuDrawer: !state.openMenuDrawer };
      }),
    reset: () => set(LayoutInitialState),
  }),
);
