import { create } from 'zustand';

interface ServerError {
	statusCode: number;
	message: string;
	details: string;
}

type State = {
	error: ServerError | null;
	token: string | null;
	appLoaded: boolean;
};

type Actions = {
	setServerError: (error: ServerError) => void;
	setToken: (token: string | null) => void;
	setAppLoaded: () => void;
};

const useCommonStore = create<State & Actions>((set) => ({
	error: null,
	token: localStorage.getItem('jwt'),
	appLoaded: false,
	allLoaded:false,
	setServerError: (error: ServerError) => {
		set({ error: error });
	},
	setToken: (token: string | null) => {
		set({ token: token });
	},
	setAppLoaded: () => {
		set({ appLoaded: true });
	}
}));


export default useCommonStore;