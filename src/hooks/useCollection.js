import axios from 'axios';
import { useCallback } from 'react';
import { createGlobalState } from 'react-use';
import useAlert from './useAlert';

const useCollectionState = createGlobalState([]);

const useCollection = () => {
	const { sendAlert } = useAlert();
	const [collection, setCollection] = useCollectionState();

	const getCollection = useCallback((collectionId) => {
		if (collectionId) {
			axios.get(`items/collections/get_collection/${collectionId}`).then((response) => {
				const message = response.data.message;
				const data = response.data.data;
	
				if (message === 'success') {
					setCollection(data);
				}
			}).catch((error) => {
				const message = error.response.data.message;
				switch (message) {
					default:
						sendAlert(message, '無法取得藝術品系列');
						break;
				}
			});
		}
	}, [sendAlert, setCollection]);

	return { collection, getCollection };
}

export default useCollection;