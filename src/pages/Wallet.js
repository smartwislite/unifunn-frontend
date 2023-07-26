import './user-pages.sass';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useAlert from '../hooks/useAlert';
import { Link } from 'react-router-dom';

const Wallet = () => {
	const { sendAlert } = useAlert();
	const token = sessionStorage.getItem('token');
	const walletAddress = sessionStorage.getItem('walletAddress');
	const [balance, setBalance] = useState('');

	useEffect(() => {
		if (token && walletAddress) {
			axios.get(`/token/getBalance/${walletAddress}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				}
			}).then((response) => {
				const message = response.data.message;
				const data = response.data.data;

				if (message === 'success') {
					setBalance(data.walletBalance);
				}
			}).catch((error) => {
				const message = error.response.data.message;

				switch (message) {
					case 'No token is provided':
						sendAlert('權限不足', '請使用正確的方式取得資料');
						break;

					default:
						sendAlert('Oops! an unexpected error occurred', message);
						break;
				}
			});
		}
	}, [token, walletAddress, sendAlert]);

	return (
		<div id='Wallet' className='user-pages'>
			<div className='page-title'>我的錢包</div>
			<div className='page-content'>
				這是您的加密錢包, 它可以幫助您交易、儲存並<Link style={{textDecoration: 'underline'}} to='/user/collections'>瀏覽</Link>您在本平台<Link style={{textDecoration: 'underline'}} to='/user/exchange'>兌換</Link>的加密點數和 NFT。</div>
			<div className='page-content'>
				<div className='display-row'>
					<div className='heading'>錢包地址</div>
					<div className='text'>{walletAddress}</div>
				</div>

				<div className='display-row'>
					<div className='heading'>餘額</div>
					<div className='text bold large'>{balance}</div>
				</div>
			</div>

			<div className='monetization-block'>Google ad</div>
		</div>
	)
}

export default Wallet;