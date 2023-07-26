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
import { FaPaypal } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

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
		if (!sessionStorage.getItem('token')) return sendAlert('請先登入');

		return sendConfirm({
			title: `是否確定購買 ${asset.assetInfo.fullName} ？`,
			message: `${asset.assetInfo.valuePrice} Point`,
			onConfirm: () => {
				setWaiting(true);
				purchaseAsset();
			}
		});
	}

	const confirmTransfer = () => {
		if (!isOwner || waiting) return false;

		return sendConfirm({
			title: `轉移 ${asset.assetInfo.fullName}`,
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
					sendAlert('請指定正確的接收者地址');
				}
			}
		});
	}

	const purchaseAsset = () => {
		const token = sessionStorage.getItem('token');
		if (!token) return sendAlert('請先登入');

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
				sendAlert('購買成功');
				getAsset({ assetId });
				getAssetActivity({ assetId });
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'Your balance is not enough':
					sendAlert('餘額不足');
					break;
				case 'This work is not available for purchasing':
					sendAlert('此作品不開放販售');
					break;
				case 'You have owned this work':
					sendAlert('已擁有此收藏品');
					break;
				default:
					console.error(message);
					sendAlert('未知錯誤', '無法購買收藏品');
					break;
			}
		});
	}

	const transferAsset = ({ receiver, assetId }) => {
		const token = sessionStorage.getItem('token');
		if (!token) return sendAlert('請先登入');

		axios.post(`items/assets/transfer`, {
			receiverAddress: receiver, 
			assetId: assetId,
		}, {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		}).then((response) => {
			const message = response.data.message;

			if (message === 'success') {
				setWaiting(false);
				sendAlert('轉移成功');
				getAsset({ assetId });
				getAssetActivity({ assetId });
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'No matching receiver is found':
					sendAlert('接收者不存在');
					break;
				case 'You have owned this work':
					sendAlert('已擁有此收藏品');
					break;
				default:
					sendAlert('未知錯誤', '無法購買收藏品');
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
						{ showContent ? null : 'Subscriber Only' }
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
					<div className='description'>擁有者 <b>{ asset.ownerInfo ? `${ asset.ownerInfo.walletAddress.slice(2, 8).toLocaleUpperCase() }` : '' }</b></div>
					
					<div className='separator'></div>

					<div className='price-wrapper'>
						<div className='price'>{asset.assetInfo?.valuePrice} P</div>
						<div className='price-second'>$100</div>
					</div>

					<div className='btn-wrapper'>
					{isOwner ? 
						(<div className={`transfer-button ${waiting ? 'disabled' : ''}`} disabled={waiting} onClick={confirmTransfer}>
							{waiting ? (<progress value={null} />) : (
								<span>轉移</span>
							)}
						</div>) : 
						(
						<>
						<div className={`buy-button ${!asset.metaData?.onSell || waiting ? 'disabled' : ''}`}  disabled={waiting} onClick={confirmPurchase}>
							{waiting ? (<progress value={null} />) : (!asset.metaData?.onSell ? (
								<span>不開放販售</span>
							) : (
								<span>點數購買</span>
							)) }
						</div>
						{ asset.metaData?.onSell ? (
						<div className='dropdown'>
							<button className="dropdown-btn">
								<IoChevronDown size={22} stroke="#fff" strokeWidth="2"/>
							</button>
							<div className="dropdown-content">
								<a href="#"><FaPaypal size={20}/> PayPal</a>
								<a href="#"><MdCreditCard size={20}/> 金融卡或信用卡</a>
							</div>
						</div>) : null }
						</>)
					}
					</div>
				</div>
			</section>

			<section className='nft-description'>
				{/* <h2>收藏品描述</h2>
				<p className='description' dangerouslySetInnerHTML={{ __html: textareaToHtml(asset.assetInfo?.description) }}></p> */}
				<div className="nft-card">
					<div className="nft-card-header"><MdOutlineSubject className="nft-card-header-icon" size={iconSize}/>說明</div>
					<div className='nft-card-content'>
						<p className="description" dangerouslySetInnerHTML={{ __html: textareaToHtml(asset.assetInfo?.description) }}></p>
					</div>
				</div>
				<div className="nft-card">
					<div className="nft-card-header"><MdSwapVert className="nft-card-header-icon" size={iconSize}/>項目活動</div>
					<div className='nft-card-content'>
						<ul className="item-activity-list" role="table">
							<li role="row">
								<div role="columnheader">
									<div>活動</div>
								</div>
								<div role="columnheader">
									<div>價格</div>
								</div>
								<div role="columnheader">
									<div>從</div>
								</div>
								<div role="columnheader">
									<div>到</div>
								</div>
								<div role="columnheader">
									<div>日期</div>
								</div>
							</li>
							{ assetActivities.length > 0 ? assetActivities.map((value, i) => {
								const iconSize = 20;
								let action, actionIcon, price = `${value.transactionAmount} P`, fromAddress = value.senderAddress, toAddress = value.receiverAddress, occurredTime = dayjs(value.createdAt).fromNow();
								switch (value.transactionDetail) {
									case 'Mint':
										action = '鑄造';
										actionIcon = <MdAutoAwesome className="activity-action-icon" size={iconSize}/>;
										fromAddress = "";
										break;
									case 'Payment':
										action = '銷售';
										actionIcon = <MdOutlineShoppingCart className="activity-action-icon" size={iconSize}/>;
										fromAddress = value.receiverAddress;
										toAddress = value.senderAddress;
										break;
									case 'Relist':
										action = '標售';
										actionIcon = <MdOutlineSell className="activity-action-icon" size={iconSize}/>;
										toAddress = "";
										break;
									case 'Transfer':
										action = '轉移';
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
								<div role="cell" style={{ gridColumn: '1/6' }}>此項目無交易活動</div>
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
