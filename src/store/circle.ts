import { CommonStoreSetter } from '@/types/common';
import { create } from 'zustand';

type DrawerState = {
  drawerFilterStep: 'fandom' | 'work_type' | null;
  drawerFilterIsOpen: boolean;
  searchFandom: string;
};
type DrawerAction = CommonStoreSetter<DrawerState> & {
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

type EditFandomWorkTypeStore = {
  tab: 'fandom' | 'workType';
  fandomSearch: string;
  fandomLocalSearch: string;
};

type EditFandomWorkTypeAction = CommonStoreSetter<EditFandomWorkTypeStore> & {
  reset: () => void;
};

const EditFandomInitialState: EditFandomWorkTypeStore = {
  tab: 'fandom',
  fandomSearch: '',
  fandomLocalSearch: '',
};

export const useEditFandomWorkTypeStore = create<
  EditFandomWorkTypeStore & EditFandomWorkTypeAction
>((set) => ({
  ...EditFandomInitialState,
  tab: 'fandom',
  fandomLocalSearch: '',
  fandomSearch: '',
  setTab: (tab) => set({ tab }),
  setFandomSearch: (search) => set({ fandomSearch: search }),
  setFandomLocalSearch: (localSearch) =>
    set({ fandomLocalSearch: localSearch }),
  reset: () => set(EditFandomInitialState),
}));
