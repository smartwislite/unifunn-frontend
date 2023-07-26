import axios from 'axios';
import { useState, useCallback } from 'react';
import useAlert from './useAlert';

const useUserAssets = () => {
	const [userAssets, setUserAssets] = useState([]);
	const { sendAlert } = useAlert();
	const token = sessionStorage.getItem('token');
	const accountId = sessionStorage.getItem('accountId');

	const getUserAssets = useCallback(({ sortBy, sortDirection, collectionId }) => {
		axios.get(`/items/assets/owned/${accountId}`, {
			params: {
				sortBy: sortBy || 'createdAt', // valuePrice, fullName, createdAt, updatedAt
				sortDirection: sortDirection || 'DESC', // ASC, DESC
				collectionId: collectionId || '',
			},
			headers: {
				Authorization: `Bearer ${token}`,
			}
		}).then((response) => {
			const message = response.data.message;
			const data = response.data.data;

			if (message === 'success') {
				setUserAssets(data);
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'Asset not found':
					sendAlert('查不到資料', '無法取得資料');
					break;

				case 'Unauthorized':
					sendAlert('權限不足', '請使用正確的方式取得資料');
					break;

				default:
					sendAlert('Oops! an unexpected error occurred', message);
					break;
			}
		});
	}, [sendAlert, accountId, token]);

	return {
		userAssets,
		getUserAssets,
	}
}

export default useUserAssets;