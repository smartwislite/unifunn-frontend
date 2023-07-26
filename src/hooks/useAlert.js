import { useCallback } from 'react';
import { createGlobalState } from 'react-use';

const useAlertState = createGlobalState({
	status: false,
	title: '',
	message: '',
	onClose: null,
});

const useAlert = () => {
	const [alert, setAlert] = useAlertState();
	
	const closeAlert = useCallback(() => {
		setAlert((currentState) => {
			if (currentState.onClose) {
				currentState.onClose();
			}
			return {
				...currentState,
				status: false,
			}
		});
	}, [setAlert]);

	const sendAlert = useCallback((title, message, onClose) => {
		setAlert({
			status: true,
			title: title || '',
			message: message || '',
			onClose: onClose,
		});
	}, [setAlert]);

	return { sendAlert, alert, closeAlert };
}

export default useAlert;