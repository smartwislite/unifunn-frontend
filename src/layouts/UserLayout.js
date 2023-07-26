import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import useAccount from '../hooks/useAccount';
import useUser from '../hooks/useUser';
import useConfirm from '../hooks/useConfirm';

import {
	MdOutlineWallet, 
	MdOutlineCreate, 
	MdOutlineSettings, 
	MdOutlineLiveHelp, 
	MdOutlineGridOn, 
	MdOutlineLogin, 
	
	MdSend, 
	MdListAlt, 
	MdOutlineChangeCircle, 
	MdUpgrade, 
	MdOutlineDiamond, 
	MdOutlineLogout
} from "react-icons/md";

const UserLayout = () => {
	const navStatus = useNavs();
	const { getUser } = useUser();
	const { logout } = useAccount();
	const { sendConfirm } = useConfirm();

	const confirmLogout = () => {
		sendConfirm({
			title: '是否確定登出？',
			onConfirm: () => {
				logout();
			}
		});
	}

	const fetchUser = useCallback(() => {
		getUser();
	}, [getUser]);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	return (
		<div id='UserLayout'>
			<Header />

			<div className='layout-center-wrap'>
				<div className='flex-container'>
					{navStatus ? (
						<div className='nav-wrap'>
							<NavLink to='/user/wallet'><MdOutlineWallet size={23} />個人錢包</NavLink>
							{/* <NavLink to='/user/collections'><MdOutlineGridOn size={23} />我的藝術品</NavLink> */}
							<NavLink to='/user/transactions'><MdListAlt size={23} />交易紀錄</NavLink>
							<NavLink to='/user/exchange'><MdOutlineChangeCircle size={23} />點數兌換</NavLink>
							<NavLink to='/user/transfer'><MdSend size={23} />發送點數</NavLink>
							<NavLink to='/user/upgrade'><MdOutlineDiamond size={23} />升級帳號</NavLink>
							<NavLink to='/user/account'><MdOutlineSettings size={23} />設定</NavLink>
							<div className='logout' onClick={confirmLogout}><MdOutlineLogout size={23} />登出</div>
						</div>
					) : null}

					<div className='content-wrap'>
						<Outlet />
					</div>
				</div>
			</div>
		</div >
	);
};

const useNavs = () => {
	const location = useLocation();
	const [navStatus, setNavStatus] = useState(true);

	useEffect(() => {
		if (location.pathname.includes('/user/collections')) {
			setNavStatus(false);
		} else {
			setNavStatus(true);
		}
	}, [location.pathname]);

	return navStatus;
}

export default UserLayout;
