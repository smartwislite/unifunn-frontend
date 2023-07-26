import useAlert from '../hooks/useAlert';

const Alert = () => {
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
					<div className='button'>確定</div>
				</div>
			</div>
		</div>
	)
}

export default Alert;