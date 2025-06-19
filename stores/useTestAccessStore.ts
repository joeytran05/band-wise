import { create } from "zustand";

interface TestAccessState {
	testAccessAllowed: boolean;
	allowAccess: () => void;
	revokeAccess: () => void;
}

export const useTestAccessStore = create<TestAccessState>((set) => ({
	testAccessAllowed: false,
	allowAccess: () => set({ testAccessAllowed: true }),
	revokeAccess: () => set({ testAccessAllowed: false }),
}));
