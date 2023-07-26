import './user-pages.sass';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import useUserCollection from '../hooks/useUserCollection';
import useUserAssets from '../hooks/useUserAssets';
import UserAssetCreate from './UserAssetCreate';
import UserAssetUpdate from './UserAssetUpdate';
import useCheckVideo from '../hooks/useCheckVideo';
import useAlert from '../hooks/useAlert';
import useConfirm from '../hooks/useConfirm';
import { Menu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import { MdMoreVert, MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

const Row = ({ asset, setShowUserAssetUpdate, setChosenUserAsset, getUserAssets, getUserCollection }) => {
	const { sendAlert } = useAlert();
	const { sendConfirm } = useConfirm();
	const { collectionId, id, assetId, fullName, uri, available, valuePrice, ownerAddress } = asset;
	const { isVideo, checkForVideo } = useCheckVideo();
	const isOwner = ownerAddress.toLowerCase() === sessionStorage.getItem('walletAddress');
	
	useEffect(() => {
		if (uri) checkForVideo(uri);
	}, [uri, checkForVideo]);

	let statusText = '';
	if (isOwner) {
		if (available) {
			statusText = '上架中';
		} else {
			statusText = '待上架';
		}
	} else {
		statusText = '已售出';
	}

	const confirmBurn = () => {
		return sendConfirm({
			title: `是否確定銷毀 ${fullName} ？`,
			onConfirm: () => {
				burnAsset();
			}
		});
	}

	const burnAsset = () => {
		const token = sessionStorage.getItem('token');
		axios.delete(`items/assets/burn_asset/${id}`, {
			headers: {
				Authorization: `Bearer ${ token }`,
			}
		}).then((response) => {
			const message = response.data.message;
			if (message === 'success') {
				sendAlert('銷毀成功');
				getUserCollection();
				getUserAssets();
			}
		}).catch((error) => {
			const message = error.response.data.message;
			sendAlert('無法銷毀此項目', message);
		});
	}

	return (
		<tr>
			<td className='left'>
				<div className='flex'>
					<div className='cover' style={{ backgroundImage: `url(${uri})` }}>
						{isVideo ? (
							<video src={`${uri}#t=0.15`} preload='metadata' muted></video>
						) : null}
					</div>
					<div className='name'><Link to={ `/collection/${collectionId}/${id}` }>{fullName}</Link></div>
				</div>
			</td>
			<td className='right nowrap'><b>{valuePrice} P</b></td>
			<td className='left nowrap blue'>{ownerAddress.slice(2, 8).toLocaleUpperCase()}</td>
			<td className='right'>{statusText}</td>
			<td className='center'>
				<Menu menuButton={<button className="actions-menu-btn" type="button"><MdMoreVert size={30}/></button>} transition>
					{isOwner ? (
					<MenuItem onClick={(e) => {
						setShowUserAssetUpdate(true);
						setChosenUserAsset(asset);
					}}><MdOutlineEdit size={20} style={{ marginRight: '.67rem' }}/> 編輯</MenuItem>) : null}
					<MenuItem onClick={confirmBurn}><MdDeleteOutline size={20} style={{ marginRight: '.67rem' }}/> 銷毀</MenuItem>
				</Menu>
			</td>
		</tr>
	)
}

const UserCollection = () => {
	const { id } = useParams();
	const { userCollection, getUserCollection } = useUserCollection(); 
	const { userAssets, getUserAssets } = useUserAssets();
	const { sendAlert } = useAlert();

	const isEmpty = useMemo(() => {
		return !userAssets.length;
	}, [userAssets.length]);

	const getUserAssetsCallback = useCallback(() => {
		getUserAssets({ collectionId: id });
	}, [getUserAssets, id]);

	const getUserCollectionCallback = useCallback(() => {
		getUserCollection({ collectionId: id });
	}, [getUserAssets, id]);

	useEffect(() => {
		getUserAssetsCallback();
		getUserCollectionCallback();
	}, [getUserAssetsCallback, getUserCollectionCallback, id]);

	const [showUserAssetCreate, setShowUserAssetCreate] = useState(false);

	const [showUserAssetUpdate, setShowUserAssetUpdate] = useState(false);

	const [chosenUserAsset, setChosenUserAsset] = useState({});

	return (
		<div id='UserCollection' className='user-pages'>
			{isEmpty ? (
				<div className='wrap'>
					<div className='page-title'><Link to='/user/collections'>我的藝術品</Link> &gt; {userCollection.fullName}</div>

					<div className='page-content'>
						<div className='empty-wrap'>
							<div className='title'>此系列還沒有藝術品喔，趕快來建立吧！</div>

							<div className='button-add' onClick={() => {
								if (sessionStorage.getItem('accountRole') == 'customer') {
									sendAlert(`此功能僅開放「<a href='/user/upgrade'>升級</a>」創作者帳戶使用`);
									return false;
								}
								setShowUserAssetCreate(true);
								setChosenUserAsset({});
							}}>
								<div className='icon'></div>
								<div className='text'>新增藝術品</div>
							</div>
						</div>
					</div>

					<div className='monetization-block'>Google ad</div>
				</div>
			) : (
				<div className='position-wrap'>
					<div className='button-add' onClick={() => {
						if (sessionStorage.getItem('accountRole') == 'customer') {
							sendAlert(`此功能僅開放「<a href='/user/upgrade'>升級</a>」創作者帳戶使用`);
							return false;
						}
						setShowUserAssetCreate(true);
						setChosenUserAsset({});
					}}>
						<div className='icon'></div>
						<div className='text'>新增藝術品</div>
					</div>
					<div className='wrap'>
						<div className='page-title'><Link to='/user/collections'>我的藝術品</Link> &gt; {userCollection.fullName}</div>
						<table>
							<thead>
								<tr>
									<th className='center nowrap' style={{ width: 'calc(100%/3)' }}>可販售項目</th>
									<th className='center nowrap' style={{ width: 'calc(100%/3)' }}>總項目</th>
									<th className='center nowrap' style={{ width: 'calc(100%/3)' }}>擁有者</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className='center bold'>{ userCollection.onSellAmount }</td>
									<td className='center bold'>{ userCollection.totalCount }</td>
									<td className='center bold'>{ userCollection.owners?.length }</td>
								</tr>
							</tbody>
						</table>
						<div className='page-content'>
							<table>
								<thead>
									<tr>
										<th className='left grow'>項目名稱</th>
										<th className='right nowrap'>價格</th>
										<th className='left nowrap'>擁有者</th>
										<th className='right nowrap'>上架狀態</th>
										<th className='center nowrap'>操作</th>
									</tr>
								</thead>

								<tbody>
									{userAssets.map((asset) => {
										const { id } = asset;
										return (
											<Row key={id} asset={asset} setShowUserAssetUpdate={setShowUserAssetUpdate} setChosenUserAsset={setChosenUserAsset} getUserAssets={getUserAssetsCallback} getUserCollection={getUserCollectionCallback} />
										)
									})}
								</tbody>
							</table>
						</div>

						<div className='monetization-block'>Google ad</div>
					</div>
				</div>
			)}

			<UserAssetCreate show={showUserAssetCreate} close={() => {
				setShowUserAssetCreate(false);
			}} collection={userCollection} getUserAssets={getUserAssetsCallback} getUserCollection={getUserCollectionCallback} />

			<UserAssetUpdate show={showUserAssetUpdate} close={() => {
				setShowUserAssetUpdate(false);
			}} getUserAssets={getUserAssetsCallback} chosenUserAsset={chosenUserAsset} getUserCollection={getUserCollectionCallback} />
		</div>
	)
}

export default UserCollection;