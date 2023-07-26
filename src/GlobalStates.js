import { createGlobalState } from 'react-use';

const useGlobalState = createGlobalState({
	loggedIn: false,
	alert: {
		status: false,
		title: '',
		message: '',
		onClose: '',
	},
	confirm: {
		status: false,
		title: '',
		message: '',
		onCancel: '',
		onConfirm: '',
	},
	account: {
		accountId: '',
		accountEmail: '',
		avatar: '',
		createdAt: '',
		updatedAt: '',
		firstName: '',
		lastName: '',
		isVerified: false,
		upgradeApply: false,
		phone: '',
		residenceAddress: '',
		role: '',
		token: '',
		walletAddress: '',
	},
});

export default useGlobalState;
