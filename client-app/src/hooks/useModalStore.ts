import { create } from 'zustand';
import useConfirmModalStore from './confirmModalStore';

type State = {
	isOpen: boolean;
	body: React.ReactNode;
	isFormDirty: boolean;
	size: 'small' | 'medium' | 'large';
};

type Actions = {
	openModal: (content: React.ReactNode, size: any) => void;
	closeModal: () => void;
	setIsFormDirty: (isDirty: boolean) => void;
};

export const useModalStore = create<State & Actions>((set, get) => ({
	isOpen: false,
	body: null,
	isFormDirty: false,
	size: 'medium',
	openModal: (body: React.ReactNode, size) => {
		set(() => ({
			isOpen: true,
			body: body,
			size: size,
		}));
	},
	closeModal: () => {
		//if form is dirty show a confirm box with useConfirmModalStore.getState().openModal
		//2 arrow functions pass over as params 
		//1st one is onConfirm (yes) will close modal
		//2nd one is onCalcen (no) do nothing 
		//The functions themselves (onConfirm and onCancel) 
		//do not execute until triggered by some user action 
		//(such as clicking a "Confirm" or "Cancel" button in your UI).
		if (get().isFormDirty) {
			useConfirmModalStore.getState().openModal(
				() => {
					set(() => ({
						isOpen: false,
						body: null,
					}));
				},
				() => {
					return;
				}
			);
		} else {
			set(() => ({
				isOpen: false,
				body: null,
			}));
		}
	},
	setIsFormDirty: (isDirty: boolean) => {
		set(() => ({
			isFormDirty: isDirty,
		}));
	},
}));
