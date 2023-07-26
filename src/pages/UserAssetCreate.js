import axios from 'axios';
import { useEffect, useState } from 'react';
import imagePreview from '../assets/image-preview.svg';
import useAlert from '../hooks/useAlert';
import useCheckVideo from '../hooks/useCheckVideo';

const initialForm = {
	collectionId: '',
	fullName: '',
	description: '',
	ipfsUri: '',
	valuePrice: '',
	amount: 1
};

const UserAssetCreate = (props) => {
	const { show, close, getUserAssets, getUserCollection, collection } = props;
	const [form, setForm] = useState(initialForm);
	const [waiting, setWaiting] = useState(false);
	const [waiting1, setWaiting1] = useState(false);
	const { fullName, valuePrice, description, ipfsUri, amount } = form;
	const { isVideo, checkForVideo } = useCheckVideo();

	const inputChange = (value, field) => {
		setForm({ ...form, [field]: value });
		if (field === 'ipfsUri') {
			checkForVideo(value);
		}
	}

	const token = sessionStorage.getItem('token');
	const { sendAlert } = useAlert();

	const clearForm = () => {
		setForm(initialForm);
	}

	useEffect(() => {
		setForm((currentValue) => {
			return {
				...currentValue,
				collectionId: collection.id,
			}
		});
	}, [collection]);

	const checkForm = (event) => {
		event.preventDefault();
		let hasError = false;

		if (Number(form.valuePrice) < 1) {
			sendAlert('價格必須高於0');
			hasError = true;
		}

		if (!Number.isInteger(Number(form.valuePrice))) {
			sendAlert('價格必須是整數');
			hasError = true;
		}

		if (Number(form.amount) < 1) {
			sendAlert('數量必須高於0');
			hasError = true;
		}

		if (!hasError) {
			setWaiting(true);
			createAsset();
		}
	}

	const createAsset = () => {
		axios.post('/items/assets/create_work_batch', form, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			setWaiting(false);
			const message = response.data.message;
			if (message === 'success') {
				getUserCollection();
				getUserAssets();
				close();
				clearForm();
				sendAlert('新增藝術品成功！');
			}
		}).catch((error) => {
			setWaiting(false);
			const message = error.response.data.message;
			switch (message) {
				case 'Collection not found':
					sendAlert('此藝術品已存在');
					break;
				case 'invalid BigNumber string (argument="value", value="aaa", code=INVALID_ARGUMENT, version=bignumber/5.7.0)':
					sendAlert('藝術品價格必須是數字');
					break;
				case 'A price of this work must be given':
					sendAlert('必須提供藝術品價格');
					break;
				case 'A full name of this work must be given':
					sendAlert('必須提供藝術品名稱');
					break;
				case 'The image has not been uploaded':
					sendAlert('必須提供圖片連結');
					break;
				case 'Sorry, only vendors can use this feature':
					sendAlert('抱歉, 只有創作者帳戶能使用這項功能');
					break;
				default:
					console.error(message);
					sendAlert(message, '無法新增藝術品');
					break;
			}
		});
	}

	const uploadImage = (event) => {
		setWaiting1(true);
		const file = event.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append('file', file, file.name);
			axios.post('/items/upload_ipfs', formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				}
			}).then((response) => {
				const message = response.data.message;
				const data = response.data.data;
				if (message === 'success') {
					setWaiting1(false);
					// setForm({ ...form, ipfsUri: data.ipfsUri });
					inputChange(data.ipfsUri, 'ipfsUri');
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
		} else{
			setWaiting1(false);
		}
	}

	return (
		<div className={`popup-wrap ${show ? 'active' : ''}`}>
			<div className='flow-wrap'>
				<div className='center-wrap'>
					<div className='close-popup' onClick={() => {
						if (waiting) return false;
						close();
					}}></div>
					<div className='popup-title'>新增藝術品</div>

					<div className='form-wrap'>

						<label className='cover-preview' style={{ backgroundImage: `url(${ipfsUri || imagePreview})` }}>
							<div className='text'>預覽素材</div>
							<input type='file' onChange={uploadImage} accept='image/jpg, image/jpeg, image/png, video/mp4' />
							{waiting1 ? (<progress value={null} />) : null}
							{isVideo ? (
								<video src={`${ form.ipfsUri }#t=0.15`} controls muted></video>
							) : null}
						</label>


						<form onSubmit={checkForm}>
							<div className='input-wrap'>
								<div className='label'>作品名稱</div>
								<input type='text' value={fullName} onChange={(e) => { inputChange(e.target.value, 'fullName') }} />
							</div>

							<div className='input-wrap'>
								<div className='label'>描述</div>
								<textarea value={description} onChange={(e) => { inputChange(e.target.value, 'description') }}></textarea>
							</div>

							<div className='input-wrap'>
								<div className='label'>圖片連結</div>
								<input type='text' value={ipfsUri} onChange={(e) => { inputChange(e.target.value, 'ipfsUri') }} />
							</div>

							<div className='input-wrap'>
								<div className='label'>價格</div>
								<input type='number' min='1' value={valuePrice} onChange={(e) => { inputChange(e.target.value, 'valuePrice') }} />
							</div>

							<div className='input-wrap'>
								<div className='label'>數量</div>
								<input type='number' min='1' value={amount} onChange={(e) => { inputChange(e.target.value, 'amount') }} />
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

export default UserAssetCreate;