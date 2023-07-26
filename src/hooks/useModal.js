import { useCallback, useEffect } from 'react';
import { createGlobalState } from 'react-use';

const useModalState = createGlobalState({
	status: false,
    contentLabel: '', 
    title: '', 
    items: [], 
	onClose: null,
});

const useModal = () => {
	const [modal, setModal] = useModalState();

	const closeModal = useCallback(() => {
		setModal((currentState) => {
			if (currentState.onClose) {
				currentState.onClose();
			}
			return {
				...currentState,
				status: false,
			}
		});
	}, [setModal]);

	const sendModal = useCallback((contentLabel, title, items, onClose) => {
		setModal({
			status: true,
            contentLabel: contentLabel, 
            title: title, 
            items: items, 
			onClose: onClose,
		});
	}, [setModal]);

	return { sendModal, modal, closeModal };
}

export default useModal;