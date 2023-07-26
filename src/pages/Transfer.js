import './user-pages.sass';
import axios from 'axios';
import { useState } from 'react';
import useAlert from '../hooks/useAlert';
import useConfirm from '../hooks/useConfirm';


const Transfer = () => {
	const token = sessionStorage.getItem('token');
	const { sendAlert } = useAlert();
	const { sendConfirm } = useConfirm();

	const [form, setForm] = useState({
		amountToTransfer: '',
		receiverEmail: '',
	});

	const { amountToTransfer, receiverEmail } = form;

	const inputChange = (event, field) => {
		setForm({ ...form, [field]: event.target.value });
	}

	const checkForm = (event) => {
		event.preventDefault();
		let hasError = false;

		if (!amountToTransfer || !receiverEmail) {
			sendAlert('請輸入所有欄位');
			hasError = true;
		}

		if (Number.isNaN(amountToTransfer)) {
			sendAlert('欲轉移平台點數請輸入阿拉伯數字');
			hasError = true;
		}

		if (Number(amountToTransfer) < 1) {
			sendAlert('點數必須高於0');
			hasError = true;
		}

		if (!Number.isInteger(Number(amountToTransfer))) {
			sendAlert('點數必須是整數');
			hasError = true;
		}

		if (!hasError) {
			sendConfirm({
				title: `您要將 ${amountToTransfer} 點數發送給`,
				message: receiverEmail,
				onConfirm: submitForm,
			});
		}
	}

	const submitForm = () => {
		axios.post('/token/transfer', form, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				sendAlert('點數發送成功！');

				setForm({
					amountToTransfer: '',
					receiverEmail: '',
				});
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'Amount to transfer must be given':
					sendAlert('請輸入欲轉移平台點數');
					break;

				case 'The balance of the sender is not enough':
					sendAlert('餘額不足');
					break;

				case 'The receiver is not found':
					sendAlert('查不到對象');
					break;

				case 'The receiver cannot be the same as the sender':
					sendAlert('不可以發送點數給自己');
					break;

				default:
					sendAlert('未知錯誤', '無法發送點數');
					break;
			}
		});
	}

	return (
		<div id='Transfer' className='user-pages'>
			<div className='page-title'>發送點數</div>
			<div className='page-content' style={{ 'marginBottom': '10px' }}>您可以透過電子郵件地址發送點數給對方</div>
			<div className='page-content'>
				<form className='form' onSubmit={checkForm}>
					<div className='input-wrap'>
						<div className='label'>欲發送對象信箱</div>
						<input type='email' value={receiverEmail} placeholder="請輸入接收者信箱地址" onChange={(e) => { inputChange(e, 'receiverEmail') }} />
					</div>

					<div className='input-wrap'>
						<div className='label'>欲轉移平台點數</div>
						<input type='number' min='1' value={amountToTransfer} placeholder="請輸入要轉移的點數" onChange={(e) => { inputChange(e, 'amountToTransfer') }} />
					</div>

					<div className='button-wrap'>
						<button>發送</button>
					</div>
				</form>
			</div>

			<div className='monetization-block'>Google ad</div>
		</div>
	)
}

export default Transfer;