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

type EditFandomWorkTypeStore = {
  tab: 'fandom' | 'workType';
  fandomSearch: string;
  fandomLocalSearch: string;
};

type EditFandomWorkTypeAction = {
  setTab: (tab: EditFandomWorkTypeStore['tab']) => void;
  setFandomSearch: (search: string) => void;
  setFandomLocalSearch: (search: string) => void;
  reset: () => void;
};

const EditFandomInitialState: EditFandomWorkTypeStore = {
  tab: 'workType',
  fandomSearch: '',
  fandomLocalSearch: '',
};

export const useEditFandomWorkTypeStore = create<
  EditFandomWorkTypeStore & EditFandomWorkTypeAction
>((set) => ({
  ...EditFandomInitialState,
  tab: 'fandom',
  setTab: (tab) => set({ tab }),
  search: '',
  setFandomSearch: (search) => set({ fandomSearch: search }),
  localSearch: '',
  setFandomLocalSearch: (localSearch) =>
    set({ fandomLocalSearch: localSearch }),
  reset: () => set(EditFandomInitialState),
}));
