import axios from 'axios';
import { useState, useCallback } from 'react';
import useAlert from './useAlert';

const useSearch = () => {
	const [searchResult, setSearchResult] = useState([]);
	const { sendAlert } = useAlert();

	const search = useCallback((searchTerm) => {
		if (searchTerm) {
			axios.get('/items/search', {
				params: {
					q: escape(searchTerm),
				},
			}).then((response) => {
				const message = response.data.message;
				const data = response.data.data;

				if (message === 'success') {
					setSearchResult(data);
				}
			}).catch((error) => {
				const message = error.response.data.message;

				switch (message) {
					// case 'Asset not found':
					// 	sendAlert('查不到資料', '無法取得藝術品系列');
					// 	break;

					case 'Query length must be larger than 2':
						sendAlert('字數過少', '無法取得搜尋結果');
						break;

					default:
						sendAlert(message, '無法取得搜尋結果');
						break;
				}
			});
		}
	}, [sendAlert]);

	const clear = useCallback(() => {
		setSearchResult([]);
	}, []);

	return {
		searchResult,
		search,
		clear,
	}
}

export default useSearch;