import useConfirm from '../hooks/useConfirm';
import { useTranslation } from 'react-i18next';

const Confirm = () => {
	const { t, i18n } = useTranslation();
	const { confirmState, onClickCancel, onClickConfirm } = useConfirm();
	const { status, title, message, inputtable } = confirmState;
	return (
		<div className={`common-confirm ${status ? 'active' : ''}`}>
			<div className='center-wrap'>
				<div className='title'>{title}</div>
				{inputtable ? 
					(<input type='text' id='confirm__input' placeholder={t('confirm.email_placeholder')}></input>) : 
					(<div className='message'>{message}</div>)}
				<div className='button-wrap' >
					<div className='button cancel' onClick={onClickCancel}>{t('confirm.no')}</div>
					<div className='button' onClick={onClickConfirm}>{t('confirm.yes')}</div>
				</div>
			</div>
		</div>
	)
}

export default Confirm;