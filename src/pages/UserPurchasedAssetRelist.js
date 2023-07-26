import axios from 'axios';
import { useEffect, useState } from 'react';
import useAlert from '../hooks/useAlert';

const initialForm = {
	valuePrice: '',
};

const UserPurchasedAssetRelist = (props) => {
	const { show, close, getUserPurchasedAssets, chosenUserPurchasedAsset } = props;
	const [form, setForm] = useState(initialForm);
	const [waiting, setWaiting] = useState(false);
	const { valuePrice } = form;
	const { fullName, description, uri, onSell } = chosenUserPurchasedAsset;

	useEffect(() => {
		if (show) {
			setForm({
				valuePrice: chosenUserPurchasedAsset.valuePrice,
			});
		}
	}, [show, chosenUserPurchasedAsset.valuePrice]);

	const inputChange = (event, field) => {
		if (field === 'available') {
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
		if (onSell) {
			setWaiting(true);
			delistPurchasedAsset();
		} else {
			let hasError = false;

			if (Number(form.valuePrice) < 1) {
				sendAlert('價格必須高於0');
				hasError = true;
			}

			if (!Number.isInteger(Number(form.valuePrice))) {
				sendAlert('價格必須是整數');
				hasError = true;
			}

			if (!hasError) {
				setWaiting(true);
				relistPurchasedAsset();
			}
		}
	}

	const delistPurchasedAsset = () => {
		axios.put(`/items/assets/update_asset/${chosenUserPurchasedAsset.id}`, {
			available: false,
		}, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				setWaiting(false);
				close();
				getUserPurchasedAssets();
				clearForm();
				sendAlert('藝術品下架成功！');
			}
		}).catch((error) => {
			setWaiting(false);
			const message = error.response.data.message;
			switch (message) {
				default:
					sendAlert('未知錯誤', '無法下架藝術品');
					break;
			}
		});
	}

	const relistPurchasedAsset = () => {
		axios.post(`/items/assets/relist_asset/${chosenUserPurchasedAsset.id}`, {
			valuePrice: form.valuePrice,
		}, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				setWaiting(false);
				close();
				getUserPurchasedAssets();
				clearForm();
				sendAlert('藝術品重新上架成功！');
			}
		}).catch((error) => {
			setWaiting(false);
			const message = error.response.data.message;
			switch (message) {
				case 'This work has been already available for purchasing':
					sendAlert('藝術品已上架中');
					break;

				default:
					sendAlert('未知錯誤', '無法重新上架藝術品');
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
					<div className='popup-title'>{onSell ? '下架藝術品' : '重新上架藝術品'}</div>

					<div className='form-wrap'>
						<label className='cover-preview' style={{ backgroundImage: `url(${uri})` }}>
						</label>

						<form onSubmit={checkForm}>
							<div className='input-wrap'>
								<div className='label'>作品名稱</div>
								<div className='fullName'>{fullName}</div>
							</div>

							<div className='input-wrap'>
								<div className='label'>描述</div>
								<div className='description'>{description}</div>
							</div>

							<div className='input-wrap'>
								<div className='label'>價格</div>
								<input type='number' value={valuePrice} onChange={(e) => { inputChange(e, 'valuePrice') }} disabled={onSell} />
							</div>

							<div className='button-wrap'>
								<button className={ waiting ? 'disabled' : null } disabled={waiting}>
									{waiting ? (<progress value={null} />) : (onSell ? '下架' : '重新上架')}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserPurchasedAssetRelist;