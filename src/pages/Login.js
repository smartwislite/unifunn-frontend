import './account-flow.sass';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useAccount from '../hooks/useAccount';
import useAlert from '../hooks/useAlert';
import logo from '../assets/logo/logo-no-background.png';
import { useTranslation } from 'react-i18next';

const Login = () => {
	const { t, i18n } = useTranslation();
	const [form, setForm] = useState({
		accountEmail: '',
		password: '',
	});

	const { login } = useAccount();
	const { sendAlert } = useAlert();
	let [searchParams, setSearchParams] = useSearchParams();

	const inputChange = (event, field) => {
		setForm({ ...form, [field]: event.target.value });
	}

	const checkForm = (event) => {
		event.preventDefault();

		let hasError = false;

		if (!form.accountEmail || !form.password) {
			sendAlert(t('account.login_all_required'));
			hasError = true;
		}

		if (!hasError) login(form, searchParams.get("back"));
	}

	return (
		<div id='Login' className='account-flow flex'>
			<div className='left-wrap'>
				<div className="wrapper">
					<Link to='/' className='logo'>
						<img src={logo} alt='' />
					</Link>
				</div>
			</div>

			<div className='wrap'>

				<form className='form' onSubmit={checkForm}>
					<div className='form-title'>{t('account.login_title')}</div>
					<div className='input-wrap'>
						<div className='label'>{t('account.login_email_title')}</div>
						<input type='text' value={form.accountEmail} onChange={(e) => { inputChange(e, 'accountEmail') }} />
					</div>

					<div className='input-wrap'>
						<div className='label'>{t('account.login_password_title')}</div>
						<input type='password' value={form.password} onChange={(e) => { inputChange(e, 'password') }} />
					</div>

					<div className='forgot-password-link'>
						<Link to='/forgot-password'>{t('account.login_forgot_password')}</Link>
					</div>

					<button className='button'>{t('account.login_title')}</button>

					<div className='link-wrap'>
						<div className='text'>{t('account.login_not_member')}</div>
						<Link to='/signup'>{t('account.login_register')}</Link>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Login;