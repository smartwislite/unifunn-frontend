import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useCallback } from 'react';
import useAlert from './useAlert';

const useAccount = () => {
	const { sendAlert } = useAlert();
	const navigate = useNavigate();

	const login = useCallback((form) => {
		axios.post('/user/auth/login', form).then((response) => {
			const message = response.data.message;
			const data = response.data.data;
			if (message === 'success') {
				sessionStorage.setItem('token', data.token);
				sessionStorage.setItem('accountId', data.accountId);
				sessionStorage.setItem('walletAddress', data.walletAddress);
				sessionStorage.setItem('accountRole', data.role);
				navigate('/user/wallet');
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'User not found':
					sendAlert('查無使用者');
					break;

				case 'Invalid password':
					sendAlert('密碼錯誤');
					break;

				default:
					sendAlert('未知錯誤', '無法登入');
					break;
			}
		});
	}, [navigate, sendAlert]);

	const logout = useCallback(() => {
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('accountId');
		sessionStorage.removeItem('walletAddress');
		navigate('/');
	}, [navigate]);

	return { login, logout };
}

export default useAccount;