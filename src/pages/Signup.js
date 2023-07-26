import './account-flow.sass';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-name-ch.png';
import { useState } from 'react';
import axios from 'axios';
import useAlert from '../hooks/useAlert';

const Signup = () => {
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
			sendAlert('請輸入所有欄位');
			hasError = true;
		}

		if (form.password !== form.confirmPassword) {
			sendAlert('請確認密碼');
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
					sendAlert('信箱重複');
					break;

				case '[Validation error]: Validation isEmail on accountEmail failed':
					sendAlert('信箱格式錯誤');
					break;

				default:
					sendAlert('未知錯誤');
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
					sendAlert('此信箱已驗證過');
				}

				if (message === 'success') {
					sendAlert('信箱驗證完成');
				}

				setPopup(false);
			}).catch((error) => {
				const message = error.response.data.message;

				switch (message) {
					case 'Verification code is not matched':
						sendAlert('驗證碼錯誤');
						break;

					case 'Bad request':
						sendAlert('未知錯誤');
						break;

					default:
						sendAlert('未知錯誤');
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
					<div className='form-title'>註冊</div>

					<div className='input-wrap'>
						<div className='label'>信箱</div>
						<input type='email' value={form.email} onChange={(e) => { inputChange(e, 'email') }} />
					</div>

					<div className='input-wrap'>
						<div className='label'>密碼</div>
						<input type='password' value={form.password} onChange={(e) => { inputChange(e, 'password') }} />
					</div>

					<div className='input-wrap'>
						<div className='label'>確認密碼</div>
						<input type='password' value={form.confirmPassword} onChange={(e) => { inputChange(e, 'confirmPassword') }} />
					</div>

					<button className='button'>註冊</button>

					<div className='link-wrap'>
						<div className='text'>已有帳號？</div>
						<Link to='/login'>登入</Link>
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