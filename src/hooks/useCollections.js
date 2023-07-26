import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { createGlobalState } from 'react-use';
import useAlert from './useAlert';

const useCollectionsState = createGlobalState([]);

const useCollections = () => {
	const { sendAlert } = useAlert();
	const [collections, setCollections] = useCollectionsState();

	const getCollections = useCallback(() => {
		axios.get('items/collections').then((response) => {
			const message = response.data.message;
			const data = response.data.data;

			if (message === 'success') {
				setCollections(data);
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				default:
					sendAlert(message, '無法取得藝術品系列');
					break;
			}
		});
	}, [sendAlert, setCollections]);

	useEffect(() => {
		getCollections();
	}, []);

	return { collections };
}

export default useCollections;