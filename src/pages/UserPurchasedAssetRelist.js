import axios from 'axios';
import { useEffect, useState } from 'react';
import useAlert from '../hooks/useAlert';
import { useTranslation } from 'react-i18next';

const initialForm = {
	valuePrice: '',
};

const UserPurchasedAssetRelist = (props) => {
	const { t, i18n } = useTranslation();
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
				sendAlert(t('user_collection.relist_msg_price_limit'));
				hasError = true;
			}

			if (!Number.isInteger(Number(form.valuePrice))) {
				sendAlert(t('user_collection.relist_msg_price_decimal'));
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
				sendAlert(t('user_collection.relist_msg_success'));
			}
		}).catch((error) => {
			setWaiting(false);
			const message = error.response.data.message;
			switch (message) {
				default:
					sendAlert(t('user_collection.relist_msg_failed'), message);
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
				sendAlert(t('user_collection.relist_msg_success'));
			}
		}).catch((error) => {
			setWaiting(false);
			const message = error.response.data.message;
			switch (message) {
				case 'This work has been already available for purchasing':
					sendAlert(t('user_collection.relist_msg_already_listed'));
					break;

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
					<div className='popup-title'>{onSell ? t('user_collection.relist_heading_off') : t('user_collection.relist_heading_on')}</div>

					<div className='form-wrap'>
						<label className='cover-preview' style={{ backgroundImage: `url(${uri})` }}>
						</label>

						<form onSubmit={checkForm}>
							<div className='input-wrap'>
								<div className='label'>{t('user_collection.relist_item_name')}</div>
								<div className='fullName'>{fullName}</div>
							</div>

							<div className='input-wrap'>
								<div className='label'>{t('user_collection.relist_item_desc')}</div>
								<div className='description'>{description}</div>
							</div>

							<div className='input-wrap'>
								<div className='label'>{t('user_collection.relist_item_price')}</div>
								<input type='number' value={valuePrice} onChange={(e) => { inputChange(e, 'valuePrice') }} disabled={onSell} />
							</div>

							<div className='button-wrap'>
								<button className={ waiting ? 'disabled' : null } disabled={waiting}>
									{waiting ? (<progress value={null} />) : (onSell ? t('user_collection.relist_heading_off') : t('user_collection.relist_heading_on'))}
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