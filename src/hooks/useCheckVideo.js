import { useState, useCallback } from 'react';

const useCheckVideo = () => {
	const [isVideo, setIsVideo] = useState(false);

	const checkForVideo = useCallback((uri) => {
		const client = new XMLHttpRequest();

		client.open('GET', uri, true);
		client.send();
		client.onreadystatechange = function () {
			if (this.readyState === this.HEADERS_RECEIVED) {
				const contentType = client.getResponseHeader('Content-Type');

				setIsVideo(contentType.includes('video'));
			}
		};
	}, []);

	return {
		isVideo,
		checkForVideo,
	}
}

export default useCheckVideo;