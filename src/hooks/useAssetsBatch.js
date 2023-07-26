import axios from 'axios';
import { useCallback } from 'react';
import { createGlobalState } from 'react-use';
import useAlert from './useAlert';

const useAssetsState = createGlobalState([]);

const useAssetsBatch = () => {
	const { sendAlert } = useAlert();
	const [assetsBatch, setAssetsBatch] = useAssetsState();

	const getAssetsBatch = useCallback(({ sortBy = 'createdAt', sortDirection = 'DESC', collectionId = '', groupBy = 1 }) => {

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
				setAssetsBatch(data);
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				default:
					sendAlert('Oops!', message);
					break;
			}
		});
	}, [sendAlert, setAssetsBatch]);

	return { assetsBatch, getAssetsBatch };
}

export default useAssetsBatch;