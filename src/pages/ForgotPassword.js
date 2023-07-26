import './account-flow.sass';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo/logo-no-background.png';
import { useState } from 'react';
import axios from 'axios';
import useAlert from '../hooks/useAlert';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
	const { t, i18n } = useTranslation();
	const { sendAlert } = useAlert();
	const navigate = useNavigate();
	const [form, setForm] = useState({
		email: '',
	});

	const inputChange = (event, field) => {
		setForm({ ...form, [field]: event.target.value });
	}

	const checkForm = (event) => {
		event.preventDefault();
		let hasError = false;

		if (!form.email) {
			sendAlert(t('account.forgot_pw_email_hint'));
			hasError = true;
		}

		if (!hasError) submitForm();
	}

	const onCloseCallback = () => {
		navigate('/');
	}

	const submitForm = () => {
		axios.post('/user/forget_password', {
			accountEmail: form.email,
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				sendAlert(t('account.forgot_pw_submit_hint'), `${ t('account.forgot_pw_submit_content_hint') } ${form.email}`, onCloseCallback);

				setForm({ email: '' });
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'This user is not registered':
					sendAlert(t('account.forgot_pw_submit_no_user'));
					break;

				default:
					sendAlert('Oops!', message);
					break;
			}
		});
	}

	return (
		<div id='ForgotPassword' className='account-flow'>
			<div className='wrap'>
				<div className='logo-wrap'>
					<Link to='/'>
						<img src={logo} alt='' />
					</Link>
				</div>

				<form className='form' onSubmit={checkForm}>
					<div className='form-title'>{t('account.forgot_pw_title')}</div>

					<div className='input-wrap'>
						<div className='label'>{t('account.login_email_title')}</div>
						<input type='text' value={form.email} onChange={(e) => { inputChange(e, 'email') }} />
					</div>

					<button className='button'>{t('account.forgot_pw_submit')}</button>
				</form>
			</div>
		</div>
	)
}

export default ForgotPassword;