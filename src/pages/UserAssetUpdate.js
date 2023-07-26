import axios from 'axios';
import { useEffect, useState } from 'react';
import imagePreview from '../assets/image-preview.svg';
import useAlert from '../hooks/useAlert';
import useCheckVideo from '../hooks/useCheckVideo';

const initialForm = {
	description: '',
	uri: '',
	available: false,
	transferable: false, 
	viewable: false
};

const UserAssetUpdate = (props) => {
	const { show, close, getUserAssets, chosenUserAsset, getUserCollection } = props;
	const [form, setForm] = useState(initialForm);
	const { description, uri, available, transferable, viewable } = form;
	const { isVideo, checkForVideo } = useCheckVideo();

	useEffect(() => {
		if (show) {
			setForm({
				description: chosenUserAsset.description,
				uri: chosenUserAsset.uri,
				available: chosenUserAsset.available,
				transferable: chosenUserAsset.transferable, 
				viewable: chosenUserAsset.viewable
			});
		}
	}, [show, chosenUserAsset.available, chosenUserAsset.uri, chosenUserAsset.description, chosenUserAsset.transferable, chosenUserAsset.viewable]);

	const inputChange = (event, field) => {
		if (['available', 'transferable', 'viewable'].includes(field)) {
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
			updateUserAsset();
		}
	}

	const updateUserAsset = () => {
		axios.put(`/items/assets/update_asset/${chosenUserAsset.id}`, {
			description: form.description,
			uri: form.uri,
			available: form.available,
			transferable: form.transferable, 
			viewable: form.viewable
		}, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				close();
				getUserAssets();
				getUserCollection();
				clearForm();
				sendAlert('修改藝術品成功！');
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case "Data too long for column 'description' at row 1":
					sendAlert('描述字數過多');
					break;

				case 'The image has not been uploaded':
					sendAlert('必須提供圖片連結');
					break;

				default:
					sendAlert('未知錯誤', '無法修改藝術品');
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
				setForm({ ...form, uri: data.ipfsUri });
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

	useEffect(() => {
		if (uri) {
			checkForVideo(uri);
		}
	}, [uri, checkForVideo])

	return (
		<div className={`popup-wrap ${show ? 'active' : ''}`}>
			<div className='flow-wrap'>
				<div className='center-wrap'>
					<div className='close-popup' onClick={close}></div>
					<div className='popup-title'>編輯藝術品</div>

					<div className='form-wrap'>
						{isVideo ? (
							<video src={`${uri}#t=0.15`} preload='metadata' controls muted></video>
						) : null}

						{!isVideo ? (
							<div className='cover-preview' style={{ backgroundImage: `url(${uri || imagePreview})` }}>
								{/* <div className='text'>預覽圖片</div>
								<input type='file' onChange={uploadImage} accept='image/jpg, image/jpeg, image/png' /> */}
							</div>
						) : null}


						<form onSubmit={checkForm}>
							<div className='input-wrap'>
								<div className='label'>描述</div>
								<textarea value={description} onChange={(e) => { inputChange(e, 'description') }}></textarea>
							</div>

							{/* <div className='input-wrap'>
								<div className='label'>圖片連結</div>
								<input style={{ cursor: 'not-allowed' }} type='text' value={uri} onChange={(e) => { inputChange(e, 'uri') }} disabled />
							</div> */}

							<div className='input-wrap checkbox'>
								<div className='label'>是否上架</div>
								<input type='checkbox' checked={available} onChange={(e) => { inputChange(e, 'available') }} />
							</div>

							<div className='input-wrap checkbox'>
								<div className='label'>是否可轉送</div>
								<input type='checkbox' checked={transferable} onChange={(e) => { inputChange(e, 'transferable') }} />
							</div>

							<div className='input-wrap checkbox'>
								<div className='label'>是否公開</div>
								<input type='checkbox' checked={viewable} onChange={(e) => { inputChange(e, 'viewable') }} />
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

export default UserAssetUpdate;