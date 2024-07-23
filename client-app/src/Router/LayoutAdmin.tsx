import { Outlet } from 'react-router-dom';
import HeaderAdmin from '../admin/layout/HeaderAdmin';

export default function LayoutAdmin() {
	

	return (
		<>
			<HeaderAdmin/>
			<div className='admin__background'>
				<Outlet />
			</div>
		</>
	);
}
