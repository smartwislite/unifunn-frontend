import './Landing.sass';
import axios from 'axios';
import { useMemo, useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { useWindowSize } from 'react-use';
import useAsset from '../hooks/useAsset';
import useAssetActivity from '../hooks/useAssetActivity';
import useCollection from '../hooks/useCollection';
import textareaToHtml from '../tools/textareaToHtml';
import useAlert from '../hooks/useAlert';
import useConfirm from '../hooks/useConfirm';
import useUser from '../hooks/useUser';
import useCheckVideo from '../hooks/useCheckVideo';
import imagePreview from '../assets/image-preview.svg';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-tw';
import { useTranslation } from 'react-i18next';
import { MdOutlineSubject, MdMultipleStop, MdOutlineShoppingCart, MdAutoAwesome, MdSwapVert, MdOutlineSell, MdCreditCard } from "react-icons/md";
// import { FaPaypal } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { IoChevronDown } from "react-icons/io5";
import { PayPalButton } from 'react-paypal-button-v2'; 
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const Asset = () => {

	const { t, i18n } = useTranslation();
	dayjs.extend(relativeTime);
	dayjs.locale(i18n.language);

	const { collectionId, assetId } = useParams();
	const { collection, getCollection } = useCollection();
	const { sendAlert } = useAlert();
	const { sendConfirm } = useConfirm();
	const { user } = useUser();
	const { isVideo, checkForVideo } = useCheckVideo();
	const { asset, getAsset } = useAsset();
	const { assetActivities, getAssetActivity } = useAssetActivity();
	const [ waiting, setWaiting ] = useState(false);
	const [ payActive, setPayActive ] = useState(false);
	const { width } = useWindowSize();

	useEffect(() => {
		if (collectionId && getCollection) getCollection(collectionId);
	}, [collectionId, getCollection]);

	const isOwner = useMemo(() => {
		return user?.walletAddress === asset?.ownerInfo?.walletAddress;
	}, [asset?.ownerInfo?.walletAddress, user?.walletAddress]);

	useEffect(() => {
		if (assetId) getAsset({ assetId });
	}, [assetId, getAsset]);

	useEffect(() => {
		if (assetId) getAssetActivity({ assetId });
	}, [assetId, getAssetActivity]);

	const confirmPurchase = () => {
		if (isOwner || !asset.metaData?.onSell || waiting) return false;
		if (!sessionStorage.getItem('token')) return sendAlert(t('account.login_first'));

		return sendConfirm({
			title: `${t('asset.action_buy_hint')} ${asset.assetInfo.fullName} ？`,
			message: `${asset.assetInfo.valuePrice} Point`,
			onConfirm: () => {
				setWaiting(true);
				purchaseAsset();
			}
		});
	}

	const confirmTransfer = () => {
		if (!isOwner || waiting || !asset.assetInfo?.transferable) return false;

		return sendConfirm({
			title: `${t('asset.activity_transfer')} ${asset.assetInfo.fullName}`,
			message: ``,
			inputtable: true, 
			onConfirm: () => {
				const receiver = document.getElementById('confirm__input').value;
				if (receiver) {
					setWaiting(true);
					transferAsset({
						receiver: receiver, 
						assetId: asset.assetInfo.id
					});
				} else {
					sendAlert(t('asset.action_transfer_hint'));
				}
			}
		});
	}

	const purchaseAsset = () => {
		const token = sessionStorage.getItem('token');
		if (!token) return sendAlert(t('account.login_first'));

		axios.post(`items/assets/purchase_asset/${asset.assetInfo.id}`, {
			offerPrice: asset.assetInfo.valuePrice,
		}, {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				setWaiting(false);
				sendAlert(t('asset.action_buy_complete'));
				getAsset({ assetId });
				getAssetActivity({ assetId });
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'Your balance is not enough':
					sendAlert(t('asset.action_buy_not_enough'));
					break;
				case 'This work is not available for purchasing':
					sendAlert(t('asset.action_buy_not_sale'));
					break;
				case 'You have owned this work':
					sendAlert(t('asset.action_buy_already_owned'));
					break;
				default:
					console.error(message);
					sendAlert('Oops!', message);
					break;
			}
		});
	}

	const confirmOrder = async (orderId) => {
		if (orderId && orderId != "") {
			try {
				const response = await axios.get(`items/paypal-api/orders/${orderId}`);
				const data = response.data.data;
				if (data?.status == 'COMPLETED') {
					return true;
				}
			} catch (error) {
				sendAlert(error);
			}
		}
		return false;
	}

	const transferAsset = ({ receiver, assetId, orderId = '' }) => {
		const token = sessionStorage.getItem('token');
		if (!token) return sendAlert(t('account.login_first'));

		axios.post(`items/assets/transfer`, {
			receiverAddress: receiver, 
			assetId: assetId,
			orderId: orderId
		}, {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		}).then((response) => {
			const message = response.data.message;
			if (message === 'success') {
				setWaiting(false);
				if (orderId == '') sendAlert(t('asset.action_buy_complete'));
				getAsset({ assetId });
				getAssetActivity({ assetId });
			}
		}).catch((error) => {
			const message = error.response.data.message;
			switch (message) {
				case 'No matching receiver is found':
					sendAlert(t('asset.action_transfer_user_not_exists'));
					break;
				case 'You have owned this work':
					sendAlert(t('asset.action_buy_already_owned'));
					break;
				default:
					sendAlert('Oops!', `${message}`);
					break;
			}
		});
	}

	useEffect(() => {
		if (asset.assetInfo?.uri) checkForVideo(asset.assetInfo?.uri);
	}, [asset, checkForVideo])

	const showContent = !asset.metaData?.subscribeOnly || [asset.creatorInfo?.walletAddress, asset.ownerInfo?.walletAddress].includes(sessionStorage.getItem('walletAddress'));
	const iconSize = width / (width > 766 ? 73 : 25);

	return (
		<div id='Asset'>
			<section className='asset-top'>
				{ showContent && isVideo ? (
					<video src={`${asset.assetInfo?.uri}#t=0.15`}  preload='metadata' controls autoPlay muted></video>
				) : (
					<div className='image-wrap' style={{ 
						backgroundImage: `url(${showContent ? asset.assetInfo?.uri : imagePreview})`, 
					}}>
						{ showContent ? null : t('landing.third_section_card_subscriber_only') }
					</div>
				)}

				<div className='intro'>
					<div className='collection-wrap'>
						<Link to={`/collection/${collection.id}`}>
							<div className='name'>{collection.fullName}</div>
						</Link>
					</div>
					<div className="token-id">#{asset.assetInfo?.assetId + 1}</div>
					<h1>{asset.assetInfo?.fullName}</h1>
					<div className='description'>{t('asset.owner')} <b>{ asset.ownerInfo ? `${ asset.ownerInfo.walletAddress.slice(2, 8).toLocaleUpperCase() }` : '' }</b></div>
					
					<div className='separator'></div>

					<div className='price-wrapper'>
						<div className='price'>{asset.assetInfo?.valuePrice} P</div>
						<div className='price-second'>${asset.assetInfo?.valuePrice}</div>
					</div>

					<div id="actions-wrapper" className='btn-wrapper'>
					{isOwner ? 
						(<div className={`transfer-button ${waiting || !asset.assetInfo?.transferable ? 'disabled' : ''}`} disabled={waiting || !asset.assetInfo?.transferable} onClick={confirmTransfer}>
							{waiting ? (<progress value={null} />) : (
								<span>{!asset.assetInfo?.transferable ? t('asset.action_no_transfer') : t('asset.action_transfer')}</span>
							)}
						</div>) : 
						(
						<>
						<div className={`buy-button ${!asset.metaData?.onSell || waiting || !sessionStorage.getItem('token') ? 'disabled' : ''}`} disabled={waiting} onClick={confirmPurchase}>
							{waiting ? (<progress value={null} />) : (!asset.metaData?.onSell ? (
								<span>{t('asset.action_no_sale')}</span>
							) : (
								<span>{t('asset.action_buy')}</span>
							)) }
						</div>
						<div className='pay-options-dropdown'>
							<button id="pay-options-btn" className={`pay-options-btn ${!asset.metaData?.onSell || !sessionStorage.getItem('token') ? 'disabled' : ''}`} disabled={!asset.metaData?.onSell || !sessionStorage.getItem('token')} onClick={() => setPayActive(!payActive)}>
								<IoChevronDown size={22} stroke="#fff" strokeWidth="2"/>
							</button>
							<div className={`pay-options-content ${!sessionStorage.getItem('token') ? 'disabled' : (payActive ? 'active' : '')}`}>
								<PayPalButton 
									amount={asset.assetInfo?.valuePrice}
									shippingPreference='NO_SHIPPING'
									onClick={(data, actions) => {
										console.log(data, actions);
									}}
									onSuccess={(details, data) => {
										sendAlert(t('asset.action_buy_complete'));
										// console.log(details, data);
										const orderId = data['orderID'];
										confirmOrder(orderId).then(confirmed => {
											if (confirmed) {
												transferAsset({
													receiver: sessionStorage.getItem('accountEmail'), 
													assetId: asset.assetInfo?.id, 
													orderId: orderId
												});
											}
										});
									}}
									onError={(err) => {
										console.error('error', err);
									}}
									onCancel={(data) => {
										console.log('cancelled', data);
									}}
									options={{
										clientId: 'Ad4RxqYOpBH-z6EOnk8a8oS45kcDwOTwhLeS2RjT7rY9OjUUfXi3hQzhD-mbAe4QdxQJll7Z53zxxAbh',
										currency: 'TWD',
										locale: i18n.language.replace('-', '_'),
										debug: false,
									}}
								/>
								<div>
									<div className='pay-options_buttons'>
										<span><RiSecurePaymentLine size={width > 767 ? 20 : 30} />{t('asset.action_buy_other_ways')}</span>
									</div>
								</div>
							</div>
						</div>
						</>)
					}
					</div>
					{!asset.metaData?.onSell ? null : (sessionStorage.getItem('token') ? null : (<Tooltip
						anchorId="actions-wrapper"
						place="bottom"
						content={t('asset.action_login_before_buy')}
					/>))}
				</div>
			</section>

			<section className='nft-description'>
				<div className="nft-card">
					<div className="nft-card-header"><MdOutlineSubject className="nft-card-header-icon" size={iconSize}/>{t('asset.desc')}</div>
					<div className='nft-card-content'>
						<p className="description" dangerouslySetInnerHTML={{ __html: textareaToHtml(asset.assetInfo?.description) }}></p>
					</div>
				</div>
				<div className="nft-card">
					<div className="nft-card-header"><MdSwapVert className="nft-card-header-icon" size={iconSize}/>{t('asset.activity')}</div>
					<div className='nft-card-content'>
						<ul className="item-activity-list" role="table">
							<li role="row">
								<div role="columnheader">
									<div>{t('asset.activity_table_name')}</div>
								</div>
								<div role="columnheader">
									<div>{t('asset.activity_table_price')}</div>
								</div>
								<div role="columnheader">
									<div>{t('asset.activity_table_from')}</div>
								</div>
								<div role="columnheader">
									<div>{t('asset.activity_table_to')}</div>
								</div>
								<div role="columnheader">
									<div>{t('asset.activity_table_date')}</div>
								</div>
							</li>
							{ assetActivities.length > 0 ? assetActivities.map((value, i) => {
								const iconSize = 20;
								let action, actionIcon, price = `${value.transactionAmount} P`, fromAddress = value.senderAddress, toAddress = value.receiverAddress, occurredTime = dayjs(value.createdAt).fromNow();
								switch (value.transactionDetail) {
									case 'Mint':
										action = t('asset.activity_mint');
										actionIcon = <MdAutoAwesome className="activity-action-icon" size={iconSize}/>;
										fromAddress = "";
										break;
									case 'Payment':
										action = t('asset.activity_payment');
										actionIcon = <MdOutlineShoppingCart className="activity-action-icon" size={iconSize}/>;
										fromAddress = value.receiverAddress;
										toAddress = value.senderAddress;
										break;
									case 'Relist':
										action = t('asset.activity_relist');
										actionIcon = <MdOutlineSell className="activity-action-icon" size={iconSize}/>;
										toAddress = "";
										break;
									case 'Transfer':
										action = t('asset.activity_transfer');
										actionIcon = <MdMultipleStop className="activity-action-icon" size={iconSize}/>;
										price = "";
										break;
								}
								return (
								<li role="row" key={i}>
									<div role="cell">{actionIcon} {action}</div>
									<div role="cell" style={{ fontVariantNumeric: 'tabular-nums' }}>{price}</div>
									<div role="cell">{fromAddress.slice(2, 8).toLocaleUpperCase()}</div>
									<div role="cell">{toAddress.slice(2, 8).toLocaleUpperCase()}</div>
									<div role="cell">{occurredTime}</div>
								</li>)
							}) : (
							<li role="row">
								<div role="cell" style={{ gridColumn: '1/6' }}>{t('asset.activity_no_rows')}</div>
							</li>)}
						</ul>
					</div>
				</div>
			</section>

			<div className='monetization-block'>Google ad</div>
		</div>
		
	);
};

export default Asset;
