import { create } from 'zustand';

interface ModalState {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	openModal: (onConfirm: () => void, onCancel: () => void) => void;
	closeModal: () => void;
}

const useConfirmModalStore = create<ModalState>((set) => ({
	isOpen: false,
	onConfirm: () => {},
	onCancel: () => {},
	//openModal is called, which immediately updates the store state to set 
	//isOpen to true and 
	//stores the two arrow functions as the new onConfirm and onCancel.
	//The functions themselves (onConfirm and onCancel) 
	//do not execute (lack of () =>) until triggered by some user action 
	//(such as clicking a "Confirm" or "Cancel" button in your UI).
	//and how onConfirm, onCancel act is depend on what you pass over as parameters
	openModal: (onConfirm, onCancel) => set({ isOpen: true, onConfirm, onCancel }),
	closeModal: () => set({ isOpen: false}),
}));

export default useConfirmModalStore;
