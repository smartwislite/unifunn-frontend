import './account-flow.sass';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-name-ch.png';
import { useState } from 'react';
import axios from 'axios';
import useAlert from '../hooks/useAlert';

const ForgotPassword = () => {
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
			sendAlert('請輸入信箱');
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
				sendAlert('已將重置訊息寄至您的信箱', `請至 ${form.email} 查看`, onCloseCallback);

				setForm({ email: '' });
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'This user is not registered':
					sendAlert('查無帳號');
					break;

				default:
					sendAlert('未知錯誤');
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
					<div className='form-title'>忘記密碼</div>

					<div className='input-wrap'>
						<div className='label'>信箱</div>
						<input type='text' value={form.email} onChange={(e) => { inputChange(e, 'email') }} />
					</div>

					<button className='button'>確定</button>
				</form>
			</div>
		</div>
	)
}

export default ForgotPassword;