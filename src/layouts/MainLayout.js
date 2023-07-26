import { Outlet, useLocation } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
	const location = useLocation();
	return (
		<div id='MainLayout' className={location.pathname === '/' ? 'paper-texture' : ''}>
			<Header />
			<div className='layout-center-wrap'>
				<Outlet />
			</div>
			<Footer />
		</div>
	);
};

export default MainLayout;
