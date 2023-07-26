import './user-pages.sass';
import axios from 'axios';
import useAlert from '../hooks/useAlert';
import useConfirm from '../hooks/useConfirm';
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router';

const Upgrade = () => {
	const { sendAlert } = useAlert();
	const token = sessionStorage.getItem('token');
	const accountId = sessionStorage.getItem('accountId');
	const { sendConfirm } = useConfirm();
	const { user } = useUser();
	const { upgradeApply, role } = user;
	const navigate = useNavigate();

	const checkForm = (event) => {
		event.preventDefault();
		sendConfirm({
			title: '確定申請帳號升級？',
			onConfirm: submitForm,
		});
	}

	const submitForm = () => {
		axios.get(`/user/apply_vendor/${accountId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				sendAlert('已提出帳號升級申請');
				navigate(0);
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'This user has already been vendor':
					sendAlert('帳號已升級過', '無法再次提出申請');
					break;

				case 'User not found':
					sendAlert('查無帳號', '無法提出申請');
					break;

				default:
					sendAlert('未知錯誤', '無法提出申請');
					break;
			}
		});
	}

	return (
		<div id='Upgrade' className='user-pages'>
			<div className='page-title'>升級成創作者！</div>
			
			<div className='page-content'>
				{ !upgradeApply ? (
					<div className='page-content'>經認證成為創作者後，即可上傳並販售您的作品或項目，一起加入我們的行列吧！</div>
				) : null }
				{upgradeApply ? (
					<div className='message'>{ role == 'customer' ? '您的升級請求已送出，請耐心等候平台驗證中' : '您的帳號已升級為創作者' }</div>
				) : (
					<form className='form' onSubmit={checkForm}>
						<div className='button-wrap'>

							<button>申請帳號升級</button>

						</div>
					</form>
				)}
			</div>

			<div className='monetization-block'>Google ad</div>
		</div>
	)
}

export default Upgrade;