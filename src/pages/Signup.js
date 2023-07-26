import './account-flow.sass';
import { Link } from 'react-router-dom';
import logo from '../assets/logo/logo-no-background.png';
import { useState } from 'react';
import axios from 'axios';
import useAlert from '../hooks/useAlert';
import { useTranslation } from 'react-i18next';

const Signup = () => {
	const { t, i18n } = useTranslation();
	const [form, setForm] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [account, setAccount] = useState({});
	const [popup, setPopup] = useState(false);
	const [verificationCode, setVerificationCode] = useState('');

	const inputChange = (event, field) => {
		setForm({ ...form, [field]: event.target.value });
	}

	const { sendAlert } = useAlert();

	const checkForm = (event) => {
		event.preventDefault();
		let hasError = false;

		if (!form.email || !form.password || !form.confirmPassword) {
			sendAlert(t('account.signup_hint_all_required'));
			hasError = true;
		}

		if (form.password !== form.confirmPassword) {
			sendAlert(t('account.signup_hint_confirm_pw'));
			hasError = true;
		}

		if (!hasError) submitForm();
	}

	const submitForm = () => {
		axios.post('/user/create_user', {
			accountEmail: form.email,
			password: form.password,
		}).then((response) => {
			const message = response.data.message;
			const data = response.data.data;

			if (message === 'success') {
				setPopup(true);
				setAccount(data);
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case '[unique violation]: accountEmail must be unique':
					sendAlert(t('account.signup_hint_unique_email'));
					break;

				case '[Validation error]: Validation isEmail on accountEmail failed':
					sendAlert(t('account.signup_hint_invalid_email'));
					break;

				default:
					sendAlert('Oops!', message);
					break;
			}
		});
	}

	const verifyEmail = (event) => {
		event.preventDefault();

		if (verificationCode) {
			axios.post('/user/auth/verification_code', {
				accountId: account.accountId,
				verifyCode: verificationCode,
			}).then((response) => {
				const message = response.data.message;

				if (message === 'This user is already authenticated') {
					sendAlert(t('account.signup_hint_verified'));
				}

				if (message === 'success') {
					sendAlert(t('account.signup_hint_verified_success'));
				}

				setPopup(false);
			}).catch((error) => {
				const message = error.response.data.message;

				switch (message) {
					case 'Verification code is not matched':
						sendAlert(t('account.signup_hint_wrong_code'));
						break;

					case 'Bad request':
						sendAlert('Bad request', message);
						break;

					default:
						sendAlert('Oops!', message);
						break;
				}
			});
		}
	}

	return (
		<div id='Signup' className='account-flow'>
			<div className='wrap'>
				<div className='logo-wrap'>
					<Link to='/'>
						<img src={logo} alt='' />
					</Link>
				</div>

				<form className='form' onSubmit={checkForm}>
					<div className='form-title'>{t('account.signup_title')}</div>

					<div className='input-wrap'>
						<div className='label'>{t('account.login_email_title')}</div>
						<input type='email' value={form.email} onChange={(e) => { inputChange(e, 'email') }} />
					</div>

					<div className='input-wrap'>
						<div className='label'>{t('account.login_password_title')}</div>
						<input type='password' value={form.password} onChange={(e) => { inputChange(e, 'password') }} />
					</div>

					<div className='input-wrap'>
						<div className='label'>{t('account.signup_confirm_pw')}</div>
						<input type='password' value={form.confirmPassword} onChange={(e) => { inputChange(e, 'confirmPassword') }} />
					</div>

					<button className='button'>{t('account.signup_title')}</button>

					<div className='link-wrap'>
						<div className='text'>{t('account.signup_already_member')}</div>
						<Link to='/login'>{t('account.login_title')}</Link>
					</div>
				</form>
			</div>

			<div className={`common-alert ${popup ? 'active' : ''}`}>
				<form className='center-wrap' onSubmit={verifyEmail}>
					<div className='title'>信箱驗證</div>
					<div className='message'>驗證碼已寄到您的註冊信箱，<br />請立即完成信箱驗證。</div>
					<div className='message'>請輸入您的驗證碼</div>
					<div className='button-wrap'>
						<input type='text' onChange={(e) => {
							setVerificationCode(e.target.value);
						}} value={verificationCode} />
					</div>
					<div className='button-wrap'>
						<button className='button'>確定</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Signup;