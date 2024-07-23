import { create } from 'zustand';
import { User, UserFormValues } from '../app/types/account';
import agent from '../app/api/agent';
import { router } from '../Router/Routes';
import useCommonStore from './commonStore';

type State = {
	user: User | null;
	loading: boolean;
};

type Actions = {
	login: (creds: UserFormValues) => Promise<void>;
	isLoggedIn: () => boolean;
	getUser: () => Promise<void>;
	logOut: () => void;
};

const useUserStore = create<State & Actions>((set, get) => ({
	user: null,
	loading: false,
	login: async (creds: UserFormValues) => {
		try {
			set({ loading: true });
			const fetchedUser = await agent.Accounts.login(creds);
			router.navigate('/admin/customer');
			useCommonStore.getState().setToken(fetchedUser.token);
			set(() => ({
				user: fetchedUser,
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			throw error;
		}
	},
	isLoggedIn: () => {
		// console.log(get().user);
		//cast to boolean with !!
		return !!get().user;
	},
	getUser: async () => {
		try {
			const user = await agent.Accounts.current();
			set({ user: user });
			console.log(get().user);
		} catch (error) {
			console.log(error);
		}
	},
	logOut: () => {
		useCommonStore.getState().setToken(null);
		set({user: null});
		// router.navigate('/');
	}
}));

export default useUserStore;
