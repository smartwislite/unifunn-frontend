import './user-pages.sass';
import { useState, useEffect } from 'react';
import axios from 'axios';
import defaultAvatar from '../assets/default-avatar.svg';
import useAlert from '../hooks/useAlert';
import useUser from '../hooks/useUser';

const Account = () => {
	const [editing, setEditing] = useState(false);
	const [waiting, setWaiting] = useState(false);
	const { sendAlert } = useAlert();
	const { user, getUser } = useUser();
	const token = sessionStorage.getItem('token');
	const accountId = sessionStorage.getItem('accountId');

	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		residenceAddress: '',
		avatar: '',
	});

	useEffect(() => {
		const { firstName, lastName, phone, residenceAddress, avatar } = user;
		setForm({
			firstName: firstName || '',
			lastName: lastName || '',
			phone: phone || '',
			residenceAddress: residenceAddress || '',
			avatar: avatar || '',
		});
	}, [user]);

	const inputChange = (value, field) => {
		setForm({ ...form, [field]: value });
	}

	const cancelForm = () => {
		setEditing(false);
		setForm({
			...form,
			avatar: user.avatar,
		});
	}

	const checkForm = (event) => {
		event.preventDefault();
		let hasError = false;

		if (!hasError) {
			submitForm();
		}
	}

	const submitForm = () => {
		axios.put(`/user/update_user/${accountId}`, {
			accountId,
			avatar: form.avatar,
			firstName: form.firstName,
			lastName: form.lastName,
			phone: form.phone,
			residenceAddress: form.residenceAddress,
		}, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			const message = response.data.message;
			if (message === 'success') {
				getUser();
				setEditing(false);
			}
		}).catch((error) => {
			const message = error.response.data.message;
			switch (message) {
				default:
					sendAlert(message, '無法更新個人資訊');
					break;
			}
		});
	}

	const uploadImage = (event) => {
		setWaiting(true);
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
					setWaiting(false);
					inputChange(data.ipfsUri, 'avatar');
				}
			}).catch((error) => {
				setWaiting(false);
				const message = error.response.data.message;
				switch (message) {
					default:
						sendAlert(message, '無法上傳圖片');
						break;
				}
			});
		} else {
			setWaiting(false);
		}
	}

	return (
		<div id='Account' className='user-pages'>
			<div className='page-title'>帳號設定</div>

			<div className='page-content'>
				<form className='form' onSubmit={(event) => { event.preventDefault() }}>
					<label className='avatar' style={{ backgroundImage: `url(${form.avatar || defaultAvatar})`, cursor: editing ? 'pointer' : null }}>
						{editing ? (<div className='text' style={{color: '#FFF', fontSize: '16px', textShadow: '#000 1px 0 10px'}}>{waiting ? null : '上傳圖檔'}</div>) : null}
						{editing ? (<input type='file' onChange={uploadImage} accept='image/jpg, image/jpeg, image/png' />) : null}
						{waiting ? (<progress style={{'width': '80%'}} value={null} />) : null}
					</label>

					<div className='input-flex-wrap'>
						<div className='label'>個人圖像網址</div>
						{editing ? (
							<input type='text' value={form.avatar} onChange={(e) => { inputChange(e.target.value, 'avatar') }} />
						) : (
							<div className='current-value'>{user.avatar}</div>
						)}
					</div>

					<div className='input-flex-wrap'>
						<div className='label'>姓</div>

						{editing ? (
							<input type='text' value={form.lastName} onChange={(e) => { inputChange(e.target.value, 'lastName') }} />
						) : (
							<div className='current-value'>{user.lastName}</div>
						)}
					</div>

					<div className='input-flex-wrap'>
						<div className='label'>名</div>

						{editing ? (
							<input type='text' value={form.firstName} onChange={(e) => { inputChange(e.target.value, 'firstName') }} />
						) : (
							<div className='current-value'>{user.firstName}</div>
						)}
					</div>

					<div className='input-flex-wrap'>
						<div className='label'>電話</div>

						{editing ? (
							<input type='text' value={form.phone} onChange={(e) => { inputChange(e.target.value, 'phone') }} />
						) : (
							<div className='current-value'>{user.phone}</div>
						)}
					</div>

					<div className='input-flex-wrap'>
						<div className='label'>通訊住址</div>

						{editing ? (
							<input type='text' value={form.residenceAddress} onChange={(e) => { inputChange(e.target.value, 'residenceAddress') }} />
						) : (
							<div className='current-value'>{user.residenceAddress}</div>
						)}
					</div>

					{editing ? (
						<div className='button-wrap flex'>
							<button className='cancel' onClick={cancelForm}>取消</button>
							<button onClick={checkForm}>確定修改</button>
						</div>
					) : (
						<div className='button-wrap'>
							<button onClick={() => {
								setEditing(true);
							}}>編輯</button>
						</div>
					)}

				</form>
			</div>

			<div className='monetization-block'>Google ad</div>
		</div>
	)
}

export default Account;