import axios from 'axios';
import { useCallback } from 'react';
import { createGlobalState } from 'react-use';
import useAlert from './useAlert';

const useAssetsState = createGlobalState([]);

const useAssets = () => {
	const { sendAlert } = useAlert();
	const [assets, setAssets] = useAssetsState();

	const getAssets = useCallback(({ sortBy = 'createdAt', sortDirection = 'DESC', collectionId = '', groupBy = 0 }) => {

		axios.get('items/assets', {
			params: {
				sortBy: sortBy, // valuePrice, fullName, createdAt, updatedAt
				sortDirection: sortDirection, // ASC, DESC
				collectionId: collectionId,
				groupBy: groupBy
			}
		}).then((response) => {
			const message = response.data.message;
			const data = response.data.data;

			if (message === 'success') {
				setAssets(data);
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				default:
					sendAlert('Oops!', message);
					break;
			}
		});
	}, [sendAlert, setAssets]);

	return { assets, getAssets };
}

export default useAssets;