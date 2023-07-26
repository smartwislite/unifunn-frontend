import axios from 'axios';
import { useCallback } from 'react';
import { createGlobalState } from 'react-use';
import useAlert from './useAlert';
import useAccount from './useAccount';

const useUserState = createGlobalState({
	accountId: '',
	accountEmail: '',
	avatar: '',
	createdAt: '',
	updatedAt: '',
	firstName: '',
	lastName: '',
	isVerified: false,
	upgradeApply: false,
	phone: '',
	residenceAddress: '',
	role: '',
	walletAddress: '',
});

const useUser = () => {
	const token = sessionStorage.getItem('token');
	const accountId = sessionStorage.getItem('accountId');
	const { sendAlert } = useAlert();
	const [user, setUser] = useUserState();
	const { logout } = useAccount();

	const getUser = useCallback(() => {
		if (token && accountId) {
			axios.get(`/user/get_user/${accountId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				}
			}).then((response) => {
				const message = response.data.message;
				const data = response.data.data;

				if (message === 'success') {
					setUser({ ...data });
				}
			}).catch((error) => {
				const message = error.response.data.message;

				switch (message) {
					case ('Unauthorized'):
						logout();
						break;
					default:
						sendAlert('未知錯誤', '無法取得帳號資料');
						break;
				}
			});
		}
	}, [sendAlert, accountId, setUser, token, logout]);

	return { user, getUser };
}

export default useUser;