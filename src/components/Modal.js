import ReactModal from 'react-modal';
import useModal from '../hooks/useModal';
import { Link } from 'react-router-dom';
import { BiPurchaseTag } from "react-icons/bi";
import { RiShoppingCartFill } from "react-icons/ri";
import { MdChevronRight } from "react-icons/md";
import { useTranslation } from 'react-i18next';

ReactModal.setAppElement('#root');

const customStyles = {
    overlay: {
        zIndex: 5
    },
    content: {
        inset: '23% 29%',
        padding: 0, 
        borderRadius: '1.3rem', 
        boxShadow: '0px 3px 1rem rgba(0,0,0,.1)'
    },
};

const Modal = () => {
    const { t, i18n } = useTranslation();
    const { modal, closeModal } = useModal();
	const { status, contentLabel, title, items } = modal;

    return (
        <ReactModal
            closeTimeoutMS={400}
            isOpen={status}
            onRequestClose={closeModal} 
            shouldCloseOnOverlayClick={true}
            style={customStyles}
            contentLabel={contentLabel}
        >
            <div className="modal-title-wrapper">
                <BiPurchaseTag size={20} style={{ marginRight: '7px' }} />
                <h3>{title}</h3>
            </div>
            <div>
                <ul className="modal-list" role="table">
                    <li role="row">
                        <div role="columnheader">
                            <div>{t('landing.third_section_card_listed_list_name')}</div>
                        </div>
                        <div role="columnheader">
                            <div>{t('landing.third_section_card_listed_list_price')}</div>
                        </div>
                        <div role="columnheader">
                            <div>{t('landing.third_section_card_listed_list_owner')}</div>
                        </div>
                        <div role="columnheader"></div>
                    </li>
                    { items.map((value, i) => (
                        <li role="row" key={`${items[0].transactionHash}_${i}`}>
                            <div role="cell">{value.fullName}</div>
                            <div role="cell"><b>{value.valuePrice} P</b></div>
                            <div className='owner' role="cell">{value.ownerInfo.walletAddress.slice(2, 8).toLocaleUpperCase()}</div>
                            <div className='actions-column' role="cell">
                                <Link to={ `/collection/${ value.collectionId }/${ value.id }` } onClick={() => closeModal()}><MdChevronRight size={22} fill='rgb(255, 255, 255)' /></Link>
                            </div>
                        </li>
                    )) }
                </ul>
            </div>
        </ReactModal>
    )
}

export default Modal;