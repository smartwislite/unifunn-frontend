import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import useConfirm from '../hooks/useConfirm';
import useAccount from '../hooks/useAccount';
import useUser from '../hooks/useUser';
// import logoName from '../assets/logo-name-ch.png';
import logoName from '../assets/logo/logo-no-background.png'
import logo from '../assets/logo.png';
import avatar from '../assets/default-avatar.svg';
import useSearch from '../hooks/useSearch';

import { HiOutlineUserCircle } from "react-icons/hi2";
import {
	MdWallet,
	MdOutlineWallet, 
	MdOutlineCreate, 
	MdOutlineSettings, 
	MdOutlineLiveHelp, 
	MdOutlineGridOn, 
	MdOutlineLogin, 
	MdSearch, 

	MdSend, 
	MdListAlt, 
	MdOutlineChangeCircle, 
	MdUpgrade, 
	MdOutlineDiamond, 
	MdOutlineLogout
} from "react-icons/md";

import { useTranslation } from 'react-i18next';

const Header = () => {
	const { t, i18n } = useTranslation();

	const navigate = useNavigate();
	const [mobileNav, setMobileNav] = useState(false);
	const { sendConfirm } = useConfirm();
	const { logout } = useAccount();
	const { user, getUser } = useUser();
	const token = sessionStorage.getItem('token');
	const location = useLocation();
	const { searchResult, search, clear } = useSearch();
	const [searchTerm, setSearchTerm] = useState('');
	const [showSearch, setShowSearch] = useState(false);

	const { width } = useWindowSize();
	const [scrollPosition, setScrollPosition] = useState(0);

	useEffect(() => {
		const updatePosition = () => {
			setScrollPosition(window.pageYOffset);
		}
		window.addEventListener("scroll", updatePosition);
		updatePosition();
		return () => window.removeEventListener("scroll", updatePosition);
	}, []);

	const confirmLogout = () => {
		sendConfirm({
			title: t('account.logout_hint'),
			onConfirm: () => {
				logout();
			}
		});
	}

	useEffect(() => {
		getUser();
	}, [getUser]);

	useEffect(() => {
		setMobileNav(false);
	}, [location.pathname]);

	useEffect(() => {
		if (searchTerm && searchTerm.length > 1) {
			search(searchTerm);
		} else {
			clear();
		}
	}, [clear, search, searchTerm]);

	const input = useRef(null);

	const searchClicked = () => {
		clear();
		setSearchTerm('');
	}

	const redirectLogin = (e) => {
		e.preventDefault();
		navigate(`/login?back=${location.pathname}`);
	}

	return (
		<div>
			<header id='Header' className={ scrollPosition > 0 ? 'active' : null }>
				<Link to='/' className='logo-wrap'>
					<img src={logoName} alt='' />
				</Link>
				{width <= 767 ? null : (
					<nav style={{ marginRight: 'auto' }}>
						<NavLink className="nav-link" to='/explore'>{t('navbar.explore')}</NavLink>
						<NavLink className="nav-link" to='/FAQ'>{t('navbar.help_center')}</NavLink>
					</nav>
				)}
				<nav>
					<div className='mobile-search-toggle' onClick={() => {
						if (!showSearch) {
							setTimeout(() => {
								input.current.focus();
							}, 100);
						}
						input.current.focus();
						setShowSearch(!showSearch);
					}}>
						<MdSearch size={width <= 767 ? width / 17 : 23}/>
					</div>

					<div className={`search-wrap ${showSearch ? 'active' : ''}`}>
						<div className='search-icon'><MdSearch size={'100%'} fill='rgb(138, 147, 155)'/></div>
						<input type='text' ref={input} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} placeholder={t('navbar.search_placeholder')} />

						<div className={`clear-search ${searchTerm ? 'active' : ''}`} onClick={() => { setSearchTerm(''); clear(); setShowSearch(false) }}></div>

						{(searchResult.collections?.length || searchResult.assets?.length) ? (
							<div className='search-result'>
								{searchResult.collections.length ? (
									<div className='result-group'>
										<div className='title'>{t('navbar.search_collection_title')}</div>

										{searchResult.collections.map((collection, i) => {
											return (
												<Link to={`/collection/${collection.id}`} key={ `${collection.id}_${i}` } onClick={searchClicked}>
													<div className='image' style={{ backgroundImage: `url(${collection.uri})` }}></div>
													<div className='text'>{collection.fullName}</div>
												</Link>
											)
										})}
									</div>
								) : null}

								{searchResult.assets.length ? (
									<div className='result-group'>
										<div className='title'>{t('navbar.search_asset_title')}</div>

										{searchResult.assets.map((asset, i) => {

											return (
												<Link to={`/collection/${asset.collectionId}/${asset.id}`} key={ `${asset.id}_${i}` } onClick={searchClicked}>
													<div className='image' style={{ backgroundImage: `url(${asset.uri})` }}></div>
													<div className='text'>{asset.fullName}</div>
												</Link>
											)
										})}
									</div>
								) : null}
							</div>
						) : null}
					</div>

					{token ? (
						<div className='logged-in'>
							<NavLink className="nav-link" to='/user/collections'>
								<div className="nav-btn">
									<MdOutlineGridOn size={width <= 767 ? 35 : 23} />
									{width <= 767 ? null : t('navbar.menu_collections')}
								</div>
							</NavLink>
							<div className='avatar'>
								<img className='avatar-image' src={user.avatar || avatar} alt='' onClick={() => {
									setMobileNav(true);
								}} />

								<div className={`outer-wrap ${mobileNav ? 'active' : ''}`}>
									<div className='hover-navs'>
										<div className='top-row'>
											<div className='close' onClick={() => {
												setMobileNav(false);
											}}></div>
										</div>
										<div className='navs-inner'>
											<NavLink to='/user/wallet'><MdOutlineWallet size={width > 766 ? 23 : 35} />{t('navbar.menu_wallet')}</NavLink>
											<NavLink to='/user/collections'><MdOutlineGridOn size={width > 766 ? 23 : 35} />{t('navbar.menu_collections')}</NavLink>
											<NavLink to='/user/transactions'><MdListAlt size={width > 766 ? 23 : 35} />{t('navbar.menu_tx_record')}</NavLink>
											<NavLink to='/user/exchange'><MdOutlineChangeCircle size={width > 766 ? 23 : 35} />{t('navbar.menu_redeem')}</NavLink>
											<NavLink to='/user/transfer'><MdSend size={width > 766 ? 23 : 35} />{t('navbar.menu_transfer_point')}</NavLink>
											<NavLink to='/user/upgrade'><MdOutlineDiamond size={width > 766 ? 23 : 35} />{t('navbar.menu_upgrade_account')}</NavLink>
											<NavLink to='/user/account'><MdOutlineSettings size={width > 766 ? 23 : 35} />{t('navbar.menu_setting')}</NavLink>
											<NavLink to='/FAQ'><MdOutlineLiveHelp size={width > 766 ? 23 : 35} />{t('navbar.help_center')}</NavLink>
											<div className='logout' onClick={confirmLogout}><MdOutlineLogout size={width > 766 ? 23 : 35} />{t('navbar.menu_logout')}</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						<>
							<NavLink className="nav-link" to={`/login?back=${location.pathname}`}>
								<div className="nav-btn">
									<MdWallet size={width <= 767 ? width / 17 : 23} />
									{width <= 767 ? null : t('navbar.login')}
								</div>
							</NavLink>
							<div className='avatar'>
								<HiOutlineUserCircle size={width <= 767 ? width / 17 : 30} onClick={() => { setMobileNav(true); }} />
								<div className={`outer-wrap ${mobileNav ? 'active' : ''}`}>
									<div className='hover-navs'>
										<div className='top-row'>
											<div className='close' onClick={() => {
												setMobileNav(false);
											}}></div>
										</div>
										<div className='navs-inner'>
											<NavLink to='/user/wallet' onClick={redirectLogin}><MdOutlineWallet size={width > 766 ? 23 : 35} />{t('navbar.menu_wallet')}</NavLink>
											<NavLink to='/user/collections' onClick={redirectLogin}><MdOutlineGridOn size={width > 766 ? 23 : 35} />{t('navbar.menu_collections')}</NavLink>
											<NavLink to='/user/collections' onClick={redirectLogin}><MdOutlineCreate size={width > 766 ? 23 : 35} />{t('navbar.menu_create')}</NavLink>
											<NavLink to='/user/account' onClick={redirectLogin}><MdOutlineSettings size={width > 766 ? 23 : 35} />{t('navbar.menu_setting')}</NavLink>
											<NavLink to='/FAQ'><MdOutlineLiveHelp size={width > 766 ? 23 : 35} />{t('navbar.help_center')}</NavLink>
										</div>
									</div>
								</div>
							</div>
						</>
					)}
				</nav>
			</header>

			<div id='header-filler'></div>
		</div>
	);
};

export default Header;
