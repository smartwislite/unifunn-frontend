import { Link } from 'react-router-dom';
import Select from 'react-select';
import { useWindowSize } from 'react-use';
// import logoName from '../assets/logo-name.png';
// import logo from '../assets/logo.png';
import { ImFacebook2, ImLinkedin, ImTwitter } from "react-icons/im";
import { GrInstagram } from "react-icons/gr";
import { HiLocationMarker } from "react-icons/hi";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaPhoneVolume } from "react-icons/fa";
import { useTranslation, withTranslation, Trans } from 'react-i18next';


const Footer = () => {
	const { t, i18n } = useTranslation();
	const { width } = useWindowSize();

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
	};

	const langOptions = [
		{ value: 'zh-TW', label: '中文 - 台灣' },
		{ value: 'en-US', label: 'English - US' },
	];

	let iconSize = 20;// width > 767 ? Math.min(width / 55, 27) : width / 30;

	return (
		<footer id='Footer'>
			<div className='footer-social'>
				<div className='footer-social__container'>
					<div className='footer-social__title'>{t('landing.footer_social')}</div>
					<ul className='footer-social__list'>
						<li>
							<a href='#' className='footer-social__link' target='_blank' rel='noreferrer noopener'><ImFacebook2 style={{ marginTop: '2px' }} size={iconSize}/></a>
						</li>
						<li>
							<a href='#' className='footer-social__link' target='_blank' rel='noreferrer noopener'><GrInstagram style={{ marginTop: '2px' }} size={iconSize}/></a>
						</li>
						<li>
							<a href='#' className='footer-social__link' target='_blank' rel='noreferrer noopener'><ImLinkedin style={{ marginTop: '2px' }} size={iconSize}/></a>
						</li>
						<li>
							<a href='#' className='footer-social__link' target='_blank' rel='noreferrer noopener'><ImTwitter style={{ marginTop: '2px' }} size={iconSize}/></a>
						</li>
					</ul>
				</div>
			</div>
			<div className='footer-bottom'>
				<nav className='footer-links'>
					<ul className='footer-links__list'>
						<li className='footer-links__list-item'>
							<div className='footer__link'>{t('landing.footer_copyright')}</div>
						</li>
					</ul>
				</nav>
				<ul className='footer-help-language'>
					<li>
						<Link to='#' className='footer__link'>{t('landing.footer_privacy_policy')}</Link>
					</li>
					<li>
						<Link to='#' className='footer__link'>{t('landing.footer_about')}</Link>
					</li>
					<li>
						<Link to='/FAQ' className='footer__link'>{t('landing.footer_help')}</Link>
					</li>
					<li>
						<Select isSearchable={false} options={langOptions} menuPlacement='top' value={langOptions.find(el => el.value == i18n.language)} onChange={(e) => changeLanguage(e.value)} />
					</li>
				</ul>
			</div>
			<div className='footer-contact'>
				<ul className='footer-contact__list' role="table">
					<li role="row">
						<div role="cell" aria-label={t('landing.footer_service_email')}><RiSendPlaneFill size={20} /></div>
						<div role="cell"><a href="mailto:gobby.wislite@gmail.com">gobby.wislite@gmail.com</a></div>
					</li>
					<li role="row">
						<div role="cell" aria-label={t('landing.footer_service_phone')}><FaPhoneVolume size={20} /></div>
						<div role="cell"><a href="tel:0287914483">02-8791-4483</a></div>
					</li>
					<li role="row">
						<div role="cell"aria-label={t('landing.footer_service_address')}><HiLocationMarker size={18} /></div>
						<div role="cell">{t('landing.footer_service_address_location')}</div>
					</li>
				</ul>
			</div>
		</footer>
	);
};

export default Footer;
