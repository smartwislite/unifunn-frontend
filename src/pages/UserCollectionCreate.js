import axios from 'axios';
import { useState } from 'react';
import imagePreview from '../assets/image-preview.svg';
import useAlert from '../hooks/useAlert';
import { useTranslation } from 'react-i18next';

const initialForm = {
	fullName: '',
	symbol: '',
	description: '',
	ipfsUri: '',
};

const UserCollectionCreate = (props) => {
	const { t, i18n } = useTranslation();
	const { show, close, getUserCollections } = props;
	const [form, setForm] = useState(initialForm);
	const [waiting, setWaiting] = useState(false);
	const [waiting1, setWaiting1] = useState(false);
	const { fullName, symbol, description, ipfsUri } = form;

	const inputChange = (event, field) => {
		setForm({ ...form, [field]: event.target.value });
	}

	const token = sessionStorage.getItem('token');
	const { sendAlert } = useAlert();

	const clearForm = () => {
		setForm(initialForm);
	}

	const checkForm = (event) => {
		event.preventDefault();
		let hasError = false;
		if (!hasError) {
			setWaiting(true);
			createCollection();
		}
	}

	const createCollection = () => {
		axios.post('/items/collections/create_collection', form, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				setWaiting(false);
				close();
				getUserCollections();
				clearForm();
				sendAlert(t('user_collection.relist_msg_success'));
			}
		}).catch((error) => {
			setWaiting(false);
			const message = error.response.data.message;
			switch (message) {
				case 'The collection is already existed':
					sendAlert(t('user_collection.create_col_msg_existed'));
					break;
				case 'A symbol of this collection must be given':
					sendAlert(t('user_collection.create_col_msg_symbol_must'));
					break;
				case 'A full name of this collection must be given':
					sendAlert(t('user_collection.create_col_msg_name_must'));
					break;
				case 'The image has not been uploaded':
					sendAlert(t('user_collection.create_col_msg_link_must'));
					break;
				case 'Sorry, only vendors can use this feature':
					sendAlert(t('user_collection.create_col_msg_vendor_only'));
					break;
				default:
					sendAlert(t('user_collection.relist_msg_failed'), message);
					break;
			}
		});
	}

	const uploadImage = (event) => {
		setWaiting1(true);
		const file = event.target.files[0];
		const formData = new FormData();

		formData.append('file', file, file.name);

		axios.post('items/upload_ipfs', formData, {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		}).then((response) => {
			const message = response.data.message;
			const data = response.data.data;

			if (message === 'success') {
				setWaiting1(false);
				setForm({ ...form, ipfsUri: data.ipfsUri });
			}
		}).catch((error) => {
			setWaiting1(false);
			const message = error.response.data.message;
			switch (message) {
				default:
					sendAlert(t('user_collection.relist_msg_failed'), message);
					break;
			}
		});
	}

	return (
		<div className={`popup-wrap ${show ? 'active' : ''}`}>
			<div className='flow-wrap'>
				<div className='center-wrap'>
					<div className='close-popup' onClick={() => {
						if (waiting) return false;
						close();
					}}></div>
					<div className='popup-title'>{t('user_collection.create_col_heading')}</div>

					<div className='form-wrap'>
						<label className='cover-preview' style={{ backgroundImage: `url(${ipfsUri || imagePreview})` }}>
							<div className='text'>{t('user_collection.create_col_item_image_preview')}</div>
							<input type='file' onChange={uploadImage} accept='image/jpg, image/jpeg, image/png' />
							{waiting1 ? (<progress value={null} />) : null}
						</label>

						<form onSubmit={checkForm}>
							<div className='input-wrap'>
								<div className='label'>{t('user_collection.create_col_item_name')}</div>
								<input type='text' value={fullName} onChange={(e) => { inputChange(e, 'fullName') }} />
							</div>

							<div className='input-wrap'>
								<div className='label'>{t('user_collection.create_col_item_desc')}</div>
								<textarea value={description} onChange={(e) => { inputChange(e, 'description') }}></textarea>
							</div>

							<div className='input-wrap'>
								<div className='label'>{t('user_collection.create_col_item_url')}</div>
								<input type='text' value={ipfsUri} onChange={(e) => { inputChange(e, 'ipfsUri') }} />
							</div>

							<div className='input-wrap'>
								<div className='label'>{t('user_collection.create_col_item_symbol')}</div>
								<input type='text' value={symbol} onChange={(e) => { inputChange(e, 'symbol') }} />
							</div>

							<div className='button-wrap'>
								<button className={ waiting ? 'disabled' : null } disabled={waiting}>
									{waiting ? (<progress value={null} />) : t('user_collection.create_col_item_button')}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserCollectionCreate;