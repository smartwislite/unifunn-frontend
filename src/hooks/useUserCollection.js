import axios from 'axios';
import { useState, useCallback } from 'react';
import useAlert from '../hooks/useAlert';

const useUserCollection = () => {
	const [userCollection, setUserCollection] = useState([]);
	const { sendAlert } = useAlert();
	const token = sessionStorage.getItem('token');

	const getUserCollection = useCallback(({ collectionId }) => {
		axios.get(`/items/collections/get_collection/${collectionId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		}).then((response) => {
			const message = response.data.message;
			const data = response.data.data;

			if (message === 'success') {
				setUserCollection(data);
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
		userCollection,
		getUserCollection,
	}
}

export default useUserCollection;