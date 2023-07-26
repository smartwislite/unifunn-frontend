import './account-flow.sass';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo/logo-no-background.png';
import axios from 'axios';
import { useState } from 'react';
import useAlert from '../hooks/useAlert';

const ResetPassword = () => {
	const { sendAlert } = useAlert();
	const [form, setForm] = useState({
		password: '',
		confirmPassword: '',
	});
	const navigate = useNavigate();

	const inputChange = (event, field) => {
		setForm({ ...form, [field]: event.target.value });
	}

	const checkForm = (event) => {
		event.preventDefault();
		let hasError = false;

		if (!form.password || !form.confirmPassword) {
			sendAlert('請輸入所有欄位');
			hasError = true;
		}

		if (form.password !== form.confirmPassword) {
			sendAlert('請確認密碼');
			hasError = true;
		}

		if (!hasError) submitForm();
	}

	const onCloseCallback = () => {
		navigate('/login');
	}

	const submitForm = () => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const token = urlParams.get('token');


		axios.post(`/user/reset_password?token=${encodeURIComponent(token)}`, {
			newPassword: form.password,
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				sendAlert('已重設密碼', '請重新登入', onCloseCallback);
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'Your token has expired':
					sendAlert('連結已過期');
					break;

				default:
					sendAlert('未知錯誤');
					break;
			}
		});
	}

	return (
		<div id='ResetPassword' className='account-flow'>
			<div className='wrap'>
				<div className='logo-wrap'>
					<Link to='/'>
						<img src={logo} alt='' />
					</Link>
				</div>

				<form className='form' onSubmit={checkForm}>
					<div className='form-title'>重設密碼</div>

					<div className='input-wrap'>
						<div className='label'>密碼</div>
						<input type='password' value={form.password} onChange={(e) => { inputChange(e, 'password') }} />
					</div>

					<div className='input-wrap'>
						<div className='label'>確認密碼</div>
						<input type='password' value={form.confirmPassword} onChange={(e) => { inputChange(e, 'confirmPassword') }} />
					</div>

					<button className='button'>重設</button>
				</form>
			</div>
		</div>
	)
}

export default ResetPassword;