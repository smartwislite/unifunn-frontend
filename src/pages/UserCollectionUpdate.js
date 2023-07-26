import axios from 'axios';
import { useEffect, useState } from 'react';
import imagePreview from '../assets/image-preview.svg';
import useAlert from '../hooks/useAlert';

const initialForm = {
	description: '',
	ipfsUri: '',
	available: false,
	subscribeOnly: false
};

const UserCollectionUpdate = (props) => {
	const { show, close, getUserCollections, chosenUserCollection } = props;
	const [form, setForm] = useState(initialForm);
	const { description, ipfsUri, available, subscribeOnly } = form;

	useEffect(() => {
		if (show) {
			setForm({
				description: chosenUserCollection.description,
				ipfsUri: chosenUserCollection.uri,
				available: chosenUserCollection.available,
				subscribeOnly: chosenUserCollection.subscribeOnly
			});
		}
	}, [show, chosenUserCollection.available, chosenUserCollection.uri, chosenUserCollection.description, chosenUserCollection.subscribeOnly]);

	const inputChange = (event, field) => {
		if (field === 'available' || field === 'subscribeOnly') {
			setForm({ ...form, [field]: event.target.checked });
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
			subscribeOnly: form.subscribeOnly
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
				sendAlert('修改系列成功！');
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'The image has not been uploaded':
					sendAlert('必須提供圖片連結');
					break;

				default:
					sendAlert('未知錯誤', '無法修改系列');
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
					sendAlert('未知錯誤', '無法上傳圖片');
					break;
			}
		});
	}

	return (
		<div className={`popup-wrap ${show ? 'active' : ''}`}>
			<div className='flow-wrap'>
				<div className='center-wrap'>
					<div className='close-popup' onClick={close}></div>
					<div className='popup-title'>編輯系列</div>

					<div className='form-wrap'>
						<div className='cover-preview' style={{ backgroundImage: `url(${ipfsUri || imagePreview})` }}>
							{/* <div className='text'>預覽圖片</div>
							<input type='file' onChange={uploadImage} accept='image/jpg, image/jpeg, image/png' /> */}
						</div>

						<form onSubmit={checkForm}>
							<div className='input-wrap'>
								<div className='label'>描述</div>
								<textarea value={description} onChange={(e) => { inputChange(e, 'description') }}></textarea>
							</div>

							{/* <div className='input-wrap'>
								<div className='label'>圖片連結</div>
								<input type='text' value={ipfsUri} onChange={(e) => { inputChange(e, 'ipfsUri') }} />
							</div> */}

							<div className='input-wrap'>
								<div className='label'>是否上架</div>
								<input type='checkbox' checked={available} onChange={(e) => { inputChange(e, 'available') }} />
							</div>

							<div className='input-wrap'>
								<div className='label'>是否限制觀看權限</div>
								<input type='checkbox' checked={subscribeOnly} onChange={(e) => { inputChange(e, 'subscribeOnly') }} />
							</div>

							<div className='button-wrap'>
								<button>更新</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserCollectionUpdate;