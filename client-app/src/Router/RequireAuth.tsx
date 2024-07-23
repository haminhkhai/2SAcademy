import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useUserStore from '../hooks/userStore';

export default function RequireAuth() {
	const userStore = useUserStore();
	const location = useLocation();

	if (!userStore.isLoggedIn()) {
		return <Navigate to='/login' state={{ from: location }} />;
	}
	return <Outlet />;
}
