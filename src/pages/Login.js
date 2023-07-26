import './account-flow.sass';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAccount from '../hooks/useAccount';
import useAlert from '../hooks/useAlert';
import logo from '../assets/logo-name-ch.png';

const Login = () => {
	const [form, setForm] = useState({
		accountEmail: '',
		password: '',
	});

	const { login } = useAccount();
	const { sendAlert } = useAlert();

	const inputChange = (event, field) => {
		setForm({ ...form, [field]: event.target.value });
	}

	const checkForm = (event) => {
		event.preventDefault();

		let hasError = false;

		if (!form.accountEmail || !form.password) {
			sendAlert('請輸入所有欄位');
			hasError = true;
		}

		if (!hasError) login(form);
	}

	return (
		<div id='Login' className='account-flow flex'>
			<div className='left-wrap'>
				<div className="wrapper">
					<Link to='/' className='logo'>
						<img src={logo} alt='' />
					</Link>
					{/* <div className='heading'>Welcome UniFunn</div> */}
					{/* <div className='intro'>歡迎範例文字</div> */}
				</div>
			</div>

			<div className='wrap'>

				<form className='form' onSubmit={checkForm}>
					<div className='form-title'>登入</div>

					<div className='input-wrap'>
						<div className='label'>信箱</div>
						<input type='text' value={form.accountEmail} onChange={(e) => { inputChange(e, 'accountEmail') }} />
					</div>

					<div className='input-wrap'>
						<div className='label'>密碼</div>
						<input type='password' value={form.password} onChange={(e) => { inputChange(e, 'password') }} />
					</div>

					<div className='forgot-password-link'>
						<Link to='/forgot-password'>忘記密碼？</Link>
					</div>

					<button className='button'>登入</button>

					<div className='link-wrap'>
						<div className='text'>還不是會員嗎？</div>
						<Link to='/signup'>註冊</Link>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Login;