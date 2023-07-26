import './user-pages.sass';
import axios from 'axios';
import { useState } from 'react';
import useAlert from '../hooks/useAlert';
import useConfirm from '../hooks/useConfirm';
import { PayPalButton } from 'react-paypal-button-v2';

const Exchange = () => {
	const { sendAlert } = useAlert();
	const token = sessionStorage.getItem('token');
	const { sendConfirm } = useConfirm();

	const [form, setForm] = useState({
		redeemCode: '',
	});

	const { redeemCode } = form;

	const inputChange = (event, field) => {
		setForm({ ...form, [field]: event.target.value });
	}

	const checkForm = (event) => {
		event.preventDefault();
		let hasError = false;

		if (!redeemCode) {
			sendAlert('請輸入兌換碼');
			hasError = true;
		}

		if (!hasError) {
			sendConfirm({
				title: `您將使用 ${redeemCode} 兌換點數`,
				onConfirm: submitForm,
			});
		}
	}

	const submitForm = () => {
		axios.post('/token/exchange', form, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				sendAlert(`${ response.data.data.transactionAmount } 點數兌換成功！`);
				setForm({
					redeemCode: '',
				});
			}
		}).catch((error) => {
			const message = error.response.data.message;
			switch (message) {
				case 'Invalid code':
					sendAlert(`${ form.redeemCode } 是無效兌換碼`);
					break;
				case 'This code has been used':
					sendAlert(`${ form.redeemCode } 已被使用過`);
					break;
				default:
					sendAlert('Oops!', message);
					break;
			}
		});
	}

	return (
		<div id='Exchange' className='user-pages'>
			<div className='page-title'>點數兌換</div>
			<div className='page-content' style={{ 'marginBottom': '10px' }}>您可以使用平台或合作夥伴提供的「兌換碼」兌換點數至您的錢包</div>
			<div className='page-content'>
				<form className='form' onSubmit={checkForm}>
					<div className='input-wrap'>
						<div className='label'>兌換碼</div>
						{/* <input type='number' min='1' value={amountToExchange} onChange={(e) => { inputChange(e, 'amountToExchange') }} /> */}
						<input type='text' value={redeemCode} onChange={e => inputChange(e, 'redeemCode')} />
					</div>
					<div className='button-wrap'>
						<button>確定</button>
					</div>
				</form>
			</div>

			<div className='paypal-button-wrap' style={{position: 'relative', zIndex: 1}}>
				{/* <PayPalButton
					amount={100}
					shippingPreference='NO_SHIPPING'
					onSuccess={(details) => {
						console.log('success');
						console.log(details);
					}}
					onError={(details) => {
						console.log('error');
						console.log(details);
					}}
					onCancel={(details) => {
						console.log('cancelled');
						console.log(details);
					}}
					options={{
						clientId: 'Ad4RxqYOpBH-z6EOnk8a8oS45kcDwOTwhLeS2RjT7rY9OjUUfXi3hQzhD-mbAe4QdxQJll7Z53zxxAbh',
						currency: 'TWD',

					}}
					style={{
						color: 'white',
						tagline: false,
					}}
				/> */}

				<div className='monetization-block'>Google ad</div>
			</div>
		</div>
	)
}

export default Exchange;