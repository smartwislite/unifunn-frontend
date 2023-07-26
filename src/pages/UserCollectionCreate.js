import axios from 'axios';
import { useState } from 'react';
import imagePreview from '../assets/image-preview.svg';
import useAlert from '../hooks/useAlert';

const initialForm = {
	fullName: '',
	symbol: '',
	description: '',
	ipfsUri: '',
};

const UserCollectionCreate = (props) => {
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
				sendAlert('新增系列成功！');
			}
		}).catch((error) => {
			setWaiting(false);
			const message = error.response.data.message;
			switch (message) {
				case 'The collection is already existed':
					sendAlert('此系列已存在');
					break;
				case 'A symbol of this collection must be given':
					sendAlert('必須提供作品集代號');
					break;
				case 'A full name of this collection must be given':
					sendAlert('必須提供系列名稱');
					break;
				case 'The image has not been uploaded':
					sendAlert('必須提供圖片連結');
					break;
				case 'Sorry, only vendors can use this feature':
					sendAlert('抱歉, 只有創作者帳戶能使用這項功能');
					break;
				default:
					sendAlert('未知錯誤', '無法新增系列');
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
					sendAlert('未知錯誤', '無法上傳圖片');
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
					<div className='popup-title'>新增系列</div>

					<div className='form-wrap'>
						<label className='cover-preview' style={{ backgroundImage: `url(${ipfsUri || imagePreview})` }}>
							<div className='text'>預覽圖片</div>
							<input type='file' onChange={uploadImage} accept='image/jpg, image/jpeg, image/png' />
							{waiting1 ? (<progress value={null} />) : null}
						</label>

						<form onSubmit={checkForm}>
							<div className='input-wrap'>
								<div className='label'>系列名稱</div>
								<input type='text' value={fullName} onChange={(e) => { inputChange(e, 'fullName') }} />
							</div>

							<div className='input-wrap'>
								<div className='label'>描述</div>
								<textarea value={description} onChange={(e) => { inputChange(e, 'description') }}></textarea>
							</div>

							<div className='input-wrap'>
								<div className='label'>圖片連結</div>
								<input type='text' value={ipfsUri} onChange={(e) => { inputChange(e, 'ipfsUri') }} />
							</div>

							<div className='input-wrap'>
								<div className='label'>作品集代號</div>
								<input type='text' value={symbol} onChange={(e) => { inputChange(e, 'symbol') }} />
							</div>

							<div className='button-wrap'>
								<button className={ waiting ? 'disabled' : null } disabled={waiting}>
									{waiting ? (<progress value={null} />) : '新增'}
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