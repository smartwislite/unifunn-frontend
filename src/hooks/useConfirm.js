import { useCallback } from 'react';
import { createGlobalState } from 'react-use';

const useConfirmState = createGlobalState({
	status: false,
	title: '',
	message: '',
	inputtable: false, 
	onCancel: null,
	onConfirm: null,
});

const useConfirm = () => {
	const [confirmState, setConfirmState] = useConfirmState();

	const closeConfirm = useCallback(() => {
		setConfirmState((currentState) => {
			return {
				...currentState,
				status: false,
			}
		});
	}, [setConfirmState]);

	const onClickCancel = useCallback(() => {
		if (confirmState.onCancel) confirmState.onCancel();
		closeConfirm();
	}, [closeConfirm, confirmState]);

	const onClickConfirm = useCallback(() => {
		if (confirmState.onConfirm) confirmState.onConfirm();
		closeConfirm();
	}, [closeConfirm, confirmState]);

	const sendConfirm = useCallback(({ title, message, inputtable, onCancel, onConfirm }) => {
		setConfirmState({
			status: true,
			title: title || '',
			message: message || '',
			inputtable: inputtable, 
			onCancel: onCancel,
			onConfirm: onConfirm,
		});
	}, [setConfirmState]);

	return { sendConfirm, confirmState, setConfirmState, onClickCancel, onClickConfirm };
}

export default useConfirm;