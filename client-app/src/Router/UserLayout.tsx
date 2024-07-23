import { Outlet } from 'react-router-dom';
import Header from '../app/layout/Header';
import Footer from '../app/layout/Footer';

export default function LayoutUser() {

	// if (
	// 	courseStore.loadingInitial ||
	// 	artistStore.loadingInitial ||
	// 	galleryStore.loadingInitial ||
	// 	blogStore.loadingInitial ||
	// 	!commonStore.appLoaded
	// ) {
	// 	return <LoadingFull />;
	// }
	return (
		<>
			<Header />
			<Outlet />
			<Footer />
		</>
	);
}
