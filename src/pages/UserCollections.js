import './user-pages.sass';
import { useEffect, useState, useMemo, useCallback } from 'react';
import UserCollectionCreate from './UserCollectionCreate';
import UserCollectionUpdate from './UserCollectionUpdate';
import { first, sortBy } from 'underscore';
import { useNavigate } from "react-router-dom";
import useUserCollections from '../hooks/useUserCollections';
import useUserPurchasedAssets from '../hooks/useUserPurchasedAssets';
import UserPurchasedAssetRelist from './UserPurchasedAssetRelist';
import useAlert from '../hooks/useAlert';

const UserCollections = () => {
	const { userCollections, getUserCollections } = useUserCollections();
	const { userPurchasedAssets, getUserPurchasedAssets } = useUserPurchasedAssets();
	const { sendAlert } = useAlert();

	const isEmpty = useMemo(() => {
		return !userCollections.length;
	}, [userCollections.length]);

	useEffect(() => {
		getUserCollections();
		getUserPurchasedAssets();
	}, [getUserCollections, getUserPurchasedAssets]);

	const [showUserCollectionCreate, setShowUserCollectionCreate] = useState(false);
	const [showUserCollectionUpdate, setShowUserCollectionUpdate] = useState(false);

	const sortedUserCollections = useMemo(() => {
		return sortBy(userCollections, 'createdAt').reverse();
	}, [userCollections]);

	const latestUserCollections = useMemo(() => {
		return first(sortedUserCollections, 3);
	}, [sortedUserCollections]);

	const [chosenUserCollection, setChosenUserCollection] = useState({});
	const [showUserPurchasedAssetRelist, setShowUserPurchasedAssetRelist] = useState(false);
	const [chosenUserAsset, setChosenUserAsset] = useState({});

	const getUserPurchasedAssetsCallback = useCallback(() => {
		getUserPurchasedAssets();
	}, [getUserPurchasedAssets]);

	const navigate = useNavigate();

	return (
		<div id='UserCollections' className='user-pages'>
			{isEmpty ? (
				<div className='wrap'>
					<div className='page-title'>我的藝術品</div>

					<div className='page-content'>
						<div className='empty-wrap'>
							<div className='title'>你還沒有藝術品系列喔，趕快來建立吧！</div>

							<div className='button-add' onClick={() => {
								if (sessionStorage.getItem('accountRole') == 'customer') {
									sendAlert(`此功能僅開放「<a href='/user/upgrade'>升級</a>」創作者帳戶使用`);
									return false;
								}
								setShowUserCollectionCreate(true);
								setChosenUserCollection({});
							}}>
								<div className='icon'></div>
								<div className='text'>新增系列</div>
							</div>
						</div>
					</div>

					<div className='monetization-block'>Google ad</div>
				</div>
			) : null}

			<div className='purchased-wrap all-wrap'>

				<div className='page-title'>已收藏的項目</div>

				<div className='page-content'>
					<table>
						<thead>
							<tr>
								<th className='left grow'>項目名稱</th>
								<th className='right nowrap'>價格</th>
								<th className='right nowrap'>上架狀態</th>
								<th className='center nowrap'>操作</th>
							</tr>
						</thead>

						<tbody>
							{userPurchasedAssets.map((asset) => {
								const { fullName, id, collectionId, uri, onSell, valuePrice, tokenId } = asset;
								return (
									<tr key={id}>
										<td className='left link' onClick={() => {
											navigate(`/collection/${collectionId}/${id}`)
										}}>
											<div className='flex'>
												<div className='cover' style={{ backgroundImage: `url(${uri})` }}></div>

												<div className='name'>{fullName}</div>
											</div>
										</td>
										<td className='right nowrap'>{valuePrice} P</td>
										<td className='right'>{onSell ? '上架中' : '待上架'}</td>
										<td className='center'>
											<div className='edit' onClick={() => {
												setShowUserPurchasedAssetRelist(true);
												setChosenUserAsset(asset);
											}}>編輯</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>

				<div className='monetization-block'>Google ad</div>

			</div>

			{!isEmpty ? (
				<div className='position-wrap all-wrap'>
					<div className='button-add' onClick={() => {
						if (sessionStorage.getItem('accountRole') == 'customer') {
							sendAlert(`此功能僅開放「<a href='/user/upgrade'>升級</a>」創作者帳戶使用`);
							return false;
						}
						setShowUserCollectionCreate(true);
						setChosenUserCollection({});
					}}>
						<div className='icon'></div>
						<div className='text'>新增系列</div>
					</div>

					<div className='page-title'>近期上架的系列</div>
					<div className='page-content'>
						<table>
							<thead>
								<tr>
									<th className='left grow'>系列名稱</th>
									<th className='right nowrap'>上架狀態</th>
									<th className='center nowrap'>操作</th>
								</tr>
							</thead>

							<tbody>
								{latestUserCollections.map((collection) => {
									const { fullName, id, uri, available } = collection;

									return (
										<tr key={id}>
											<td className='left link' onClick={() => {
												navigate(`/user/collections/${id}`)
											}}>
												<div className='flex'>
													<div className='cover' style={{ backgroundImage: `url(${uri})` }}></div>

													<div className='name'>{fullName}</div>
												</div>
											</td>

											<td className='right'>{available ? '上架中' : '-'}</td>

											<td className='center'>
												<div className='edit' onClick={() => {
													setShowUserCollectionUpdate(true);
													setChosenUserCollection(collection);
												}}>編輯</div>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>

					<div className='monetization-block'>Google ad</div>

					{userCollections.length > 3 ? (
						<div className='all-wrap'>
							<div className='page-title'>所有上架的系列</div>

							<div className='page-content'>
								<table>
									<thead>
										<tr>
											<th className='left grow'>系列名稱</th>
											<th className='right nowrap'>上架狀態</th>
											<th className='center nowrap'>操作</th>
										</tr>
									</thead>

									<tbody>
										{sortedUserCollections.map((collection) => {
											const { fullName, id, uri, available } = collection;

											return (
												<tr key={id}>
													<td className='left link' onClick={() => {
														navigate(`/user/collections/${id}`)
													}}>
														<div className='flex'>
															<div className='cover' style={{ backgroundImage: `url(${uri})` }}></div>

															<div className='name'>{fullName}</div>
														</div>
													</td>

													<td className='right'>{available ? '上架中' : '-'}</td>

													<td className='center'>
														<div className='edit' onClick={() => {
															setShowUserCollectionUpdate(true);
															setChosenUserCollection(collection);
														}}>編輯</div>
													</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>

							<div className='monetization-block'>Google ad</div>
						</div>
					) : null}
				</div>
			) : null}

			<UserCollectionCreate show={showUserCollectionCreate} close={() => {
				setShowUserCollectionCreate(false);
			}} getUserCollections={getUserCollections} />

			<UserCollectionUpdate show={showUserCollectionUpdate} close={() => {
				setShowUserCollectionUpdate(false);
			}} getUserCollections={getUserCollections} chosenUserCollection={chosenUserCollection} />

			<UserPurchasedAssetRelist show={showUserPurchasedAssetRelist} close={() => {
				setShowUserPurchasedAssetRelist(false);
			}} getUserPurchasedAssets={getUserPurchasedAssetsCallback} chosenUserPurchasedAsset={chosenUserAsset} />
		</div>
	)
}



export default UserCollections;