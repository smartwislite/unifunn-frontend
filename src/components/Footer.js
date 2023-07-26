import { Link } from 'react-router-dom';
import Select from 'react-select';
import { useWindowSize } from 'react-use';
import logo from '../assets/logo-name-ch.png';
import { ImFacebook, ImLinkedin2, ImTwitter } from "react-icons/im";
import { GrInstagram, GrLanguage } from "react-icons/gr";
import { HiOutlineMail, HiLocationMarker, HiPhone } from "react-icons/hi";
import { useTranslation, withTranslation, Trans } from 'react-i18next';


const Footer = () => {
	const { t, i18n } = useTranslation();
	const { width } = useWindowSize();

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
	};

	const langOptions = [
		{ value: 'zh-TW', label: '繁體中文' },
		{ value: 'en-US', label: 'English' },
	];

	let iconSize = width > 767 ? Math.min(width / 55, 22) : width / 30;

	return (
		<div id='Footer'>
			<div className='center-wrap'>
				<div className='about-row'>
					<div className='logo-wrapper'>
						<Link to='/' className='logo'>
							<img src={logo} alt='' />
							{t('landing.footer_about')}
						</Link>
					</div>
					
					<div className='social'>
						<a href='' target='_blank' rel='noreferrer noopener'><ImFacebook size={iconSize}/></a>
						<a href='' target='_blank' rel='noreferrer noopener'><GrInstagram size={iconSize}/></a>
						<a href='' target='_blank' rel='noreferrer noopener'><ImLinkedin2 size={iconSize}/></a>
						<a href='' target='_blank' rel='noreferrer noopener'><ImTwitter size={iconSize}/></a>
					</div>
				</div>

				<div className='copyright-row'>
					{/* <div className='copyright'>Copyright © 2022 晶睿科技. All Rights Reserved.</div> */}
					<div className='copyright'>
						<p style={{ marginBottom: '10px' }}>{t('landing.footer_copyright')}</p>
						<ul className="info-list" role="table">
							<li role="row">
								<div role="cell" aria-label={t('landing.footer_service_email')}><HiOutlineMail size={20} /></div>
								<div role="cell"><a href="mailto:gobby.wislite@gmail.com">gobby.wislite@gmail.com</a></div>
							</li>
							<li role="row">
								<div role="cell" aria-label={t('landing.footer_service_phone')}><HiPhone size={18} /></div>
								<div role="cell"><a href="tel:0287914483">02-8791-4483</a></div>
							</li>
							<li role="row">
								<div role="cell"aria-label={t('landing.footer_service_address')}><HiLocationMarker size={18} /></div>
								<div role="cell">114 台北市內湖區新湖二路 128 號 5 樓之 2</div>
							</li>
						</ul>
					</div>
					<div className='language-chooser'>
						<GrLanguage className='chooser-prefix' size={iconSize}/>
						<Select isSearchable={false} options={langOptions} menuPlacement='top' defaultValue={langOptions.find(el => el.value == i18n.language)} onChange={(e) => changeLanguage(e.value)} />
					</div>
				</div>
				
			</div>
		</div>
	);
};

export default Footer;
