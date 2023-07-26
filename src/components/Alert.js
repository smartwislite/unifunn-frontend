import useAlert from '../hooks/useAlert';
import { useTranslation } from 'react-i18next';

const Alert = () => {
	const { t, i18n } = useTranslation();
	const { alert, closeAlert } = useAlert();
	const { status, title, message } = alert;

	return (
		<div className={`common-alert ${status ? 'active' : ''}`}>
			<div className='center-wrap'>
				{/* <div className='title'>{title}</div> */}
				<div className='title' dangerouslySetInnerHTML={{ __html: title }} /> 
				{/* <div className='message'>{message}</div> */}
				<div className='message' dangerouslySetInnerHTML={{ __html: message }} />
				<div className='button-wrap' onClick={closeAlert}>
					<div className='button'>{t('alert.yes')}</div>
				</div>
			</div>
		</div>
	)
}

export default Alert;