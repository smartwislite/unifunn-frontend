import axios from 'axios';
import { useEffect, useState } from 'react';
import imagePreview from '../assets/image-preview.svg';
import useAlert from '../hooks/useAlert';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

const initialForm = {
	description: '',
	ipfsUri: '',
	available: false,
	subscribeOnly: false,
	category: ''
};

const UserCollectionUpdate = (props) => {
	const { t, i18n } = useTranslation();
	const { show, close, getUserCollections, chosenUserCollection } = props;
	const [form, setForm] = useState(initialForm);
	const { description, ipfsUri, available, subscribeOnly, category } = form;

	useEffect(() => {
		if (show) {
			setForm({
				description: chosenUserCollection.description,
				ipfsUri: chosenUserCollection.uri,
				available: chosenUserCollection.available,
				subscribeOnly: chosenUserCollection.subscribeOnly,
				category: chosenUserCollection.category
			});
		}
	}, [show, chosenUserCollection.available, chosenUserCollection.uri, chosenUserCollection.description, chosenUserCollection.subscribeOnly]);

	const inputChange = (event, field) => {
		if (field === 'available' || field === 'subscribeOnly') {
			setForm({ ...form, [field]: event.target.checked });
		} else if (field == 'category') {
			setForm({ ...form, [field]: event.value });
		} else {
			setForm({ ...form, [field]: event.target.value });
		}
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
			updateCollection();
		}
	}

	const updateCollection = () => {
		axios.put(`/items/collections/update_collection/${chosenUserCollection.id}`, {
			description: form.description,
			ipfsUri: form.ipfsUri,
			available: form.available,
			subscribeOnly: form.subscribeOnly, 
			category: form.category
		}, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				close();
				getUserCollections();
				clearForm();
				sendAlert(t('user_collection.relist_msg_success'));
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'The image has not been uploaded':
					sendAlert(t('user_collection.update_col_msg_image_must'));
					break;

				default:
					sendAlert(t('user_collection.relist_msg_failed'), message);
					break;
			}
		});
	}

	const uploadImage = (event) => {
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
				setForm({ ...form, ipfsUri: data.ipfsUri });
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				default:
					sendAlert(t('user_collection.relist_msg_failed'), message);
					break;
			}
		});
	}

	const catOptions = [
		{ value: 'art', label: t('explore.panel_category_art') }, 
		{ value: 'gaming', label: t('explore.panel_category_gaming') }, 
		{ value: 'memberships', label: t('explore.panel_category_memberships') }, 
		{ value: 'education', label: t('explore.panel_category_education') }, 
		{ value: '', label: t('explore.panel_category_others') }
	];

	return (
		<div className={`popup-wrap ${show ? 'active' : ''}`}>
			<div className='flow-wrap'>
				<div className='center-wrap'>
					<div className='close-popup' onClick={close}></div>
					<div className='popup-title'>{t('user_collection.update_col_heading')}</div>

					<div className='form-wrap'>
						<div className='cover-preview' style={{ backgroundImage: `url(${ipfsUri || imagePreview})` }}>
							{/* <div className='text'>預覽圖片</div>
							<input type='file' onChange={uploadImage} accept='image/jpg, image/jpeg, image/png' /> */}
						</div>

						<form onSubmit={checkForm}>
							
							<div className='input-wrap'>
								<div className='label'>{t('user_collection.update_col_item_desc')}</div>
								<textarea value={description} onChange={(e) => { inputChange(e, 'description') }}></textarea>
							</div>

							<div className='input-wrap'>
								<div className='label'>{t('user_collection.update_col_item_cat')}</div>
								<Select 
									isSearchable={false} 
									value={catOptions.find(el => el.value == category)}
									onChange={(e) => inputChange(e, 'category')}
									options={catOptions}
								/>
							</div>

							{/* <div className='input-wrap'>
								<div className='label'>圖片連結</div>
								<input type='text' value={ipfsUri} onChange={(e) => { inputChange(e, 'ipfsUri') }} />
							</div> */}

							<div className='input-wrap'>
								<div className='label'>{t('user_collection.update_col_item_status')}</div>
								<input type='checkbox' checked={available} onChange={(e) => { inputChange(e, 'available') }} />
							</div>

							<div className='input-wrap'>
								<div className='label'>{t('user_collection.update_col_item_viewable')}</div>
								<input type='checkbox' checked={subscribeOnly} onChange={(e) => { inputChange(e, 'subscribeOnly') }} />
							</div>

							<div className='button-wrap'>
								<button>{t('user_collection.update_col_button')}</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserCollectionUpdate;