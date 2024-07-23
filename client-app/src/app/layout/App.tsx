import PopupContainer from '../../features/popup/PopupContainer';
import { useLocation } from 'react-router-dom';
import Login from '../../admin/account/Login';
import { ToastContainer } from 'react-toastify';
import ConfirmModal from '../../features/popup/ConfirmModal';
import LayoutAdmin from '../../Router/LayoutAdmin';
import LayoutUser from '../../Router/UserLayout';
import { useEffect } from 'react';
import useCommonStore from '../../hooks/commonStore';
import useUserStore from '../../hooks/userStore';

function App() {
	const location = useLocation();
	const userStore = useUserStore();
	const commonStore = useCommonStore();

	useEffect(() => {
		if (commonStore.token) {
			userStore.getUser().then(() => {
				commonStore.setAppLoaded();
				console.log('onload ' + useUserStore.getState().user);
			});
		} else {
			commonStore.setAppLoaded();
		}
	}, [commonStore.token]);

	useEffect(() => {
		const token = commonStore.token;
		if (token) {
			localStorage.setItem('jwt', token);
		} else {
			localStorage.removeItem('jwt');
		}
	}, [commonStore.token]);

	//this loading is kinda important,
	//without it RequireAuth will run asynchonously and cause user state null
	// if (!commonStore.appLoaded) return <LoadingFull />;
	return (
		<>
			<PopupContainer />
			<ConfirmModal/>
			<ToastContainer
				className='toast-position'
				position='top-center'
				hideProgressBar
				theme='colored'
			/>
			{location.pathname === '/login' ? (
				<Login />
			) : location.pathname.indexOf('admin') !== -1 ? (
				<LayoutAdmin />
			) : (
				<LayoutUser />
			)}
		</>
	);
}

export default App;
