import axios from 'axios';
import { useCallback, useState } from 'react';
import useAlert from './useAlert';

const useAssetActivity = () => {
	const [ assetActivities, setAssetActivities ] = useState([]);
	const { sendAlert } = useAlert();

	const getAssetActivity = useCallback(({ assetId }) => {
		axios.get(`items/assets/history/${assetId}`).then((response) => {
			const message = response.data.message;
			const data = response.data.data;
			if (message === 'success') {
				setAssetActivities(data);
			}
		}).catch((error) => {
			const message = error.response.data.message;
			switch (message) {
				default:
					sendAlert('Oops!', message);
					break;
			}
		});
	}, [sendAlert]);

	return { assetActivities, getAssetActivity };
}

export default useAssetActivity;