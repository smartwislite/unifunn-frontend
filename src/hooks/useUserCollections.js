import axios from 'axios';
import { useState, useCallback } from 'react';
import useAlert from '../hooks/useAlert';

const useUserCollections = () => {
	const [userCollections, setCollections] = useState([]);
	const { sendAlert } = useAlert();
	const token = sessionStorage.getItem('token');

	const getUserCollections = useCallback(() => {
		axios.get('/user/wallet/collections', {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		}).then((response) => {
			const message = response.data.message;
			const data = response.data.data;

			if (message === 'success') {
				setCollections(data);
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'Unauthorized':
					sendAlert('權限不足', '請使用正確的方式取得資料');
					break;

				default:
					sendAlert('Oops! an unexpected error occurred', message);
					break;
			}
		});
	}, [sendAlert, token]);

	return {
		userCollections,
		getUserCollections,
	}
}

export default useUserCollections;