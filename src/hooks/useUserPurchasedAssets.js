import axios from 'axios';
import { useState, useCallback } from 'react';
import useAlert from './useAlert';

const useUserPurchasedAssets = () => {
	const [userPurchasedAssets, setUserPurchasedAssets] = useState([]);
	const { sendAlert } = useAlert();
	const token = sessionStorage.getItem('token');

	const getUserPurchasedAssets = useCallback(() => {
		axios.get('/user/wallet/purchased', {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		}).then((response) => {
			const message = response.data.message;
			const data = response.data.data;

			if (message === 'success') {
				setUserPurchasedAssets(data.works);
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {

				default:
					sendAlert('Oops!', message);
					break;
			}
		});
	}, [sendAlert, token]);

	return {
		userPurchasedAssets,
		getUserPurchasedAssets,
	}
}

export default useUserPurchasedAssets;