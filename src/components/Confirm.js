import useConfirm from '../hooks/useConfirm';

const Confirm = () => {
	const { confirmState, onClickCancel, onClickConfirm } = useConfirm();
	const { status, title, message, inputtable } = confirmState;
	return (
		<div className={`common-confirm ${status ? 'active' : ''}`}>
			<div className='center-wrap'>
				<div className='title'>{title}</div>
				{inputtable ? 
					(<input type='text' id='confirm__input' placeholder='輸入接收者地址'></input>) : 
					(<div className='message'>{message}</div>)}
				<div className='button-wrap' >
					<div className='button cancel' onClick={onClickCancel}>取消</div>
					<div className='button' onClick={onClickConfirm}>確定</div>
				</div>
			</div>
		</div>
	)
}

export default Confirm;