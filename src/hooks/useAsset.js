import axios from 'axios';
import { useCallback, useState } from 'react';
import useAlert from './useAlert';

const useAsset = () => {
	const [asset, setAsset] = useState({});
	const { sendAlert } = useAlert();

	const getAsset = useCallback(({ assetId }) => {

		axios.get(`items/assets/get_asset/${assetId}`).then((response) => {
			const message = response.data.message;
			const data = response.data.data;
			if (message === 'success') {
				setAsset(data);
			}
		}).catch((error) => {
			const message = error.response.data.message;
			switch (message) {
				default:
					sendAlert('未知錯誤', '無法取得藝術品');
					break;
			}
		});
	}, [sendAlert]);

	return { asset, getAsset };
}

export default useAsset;