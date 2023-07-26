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
import { useTranslation } from 'react-i18next';

const UserCollections = () => {
	const { t, i18n } = useTranslation();
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

	// const latestUserCollections = useMemo(() => {
	// 	return first(sortedUserCollections, 3);
	// }, [sortedUserCollections]);

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
					<div className='page-title'>{t('user_collection.heading_user_created')}</div>

					<div className='page-content'>
						<div className='empty-wrap'>
							<div className='title'>{t('user_collection.created_hint_no_data')}</div>

							<div className='button-add' onClick={() => {
								if (sessionStorage.getItem('accountRole') == 'customer') {
									sendAlert(t('user_collection.created_hint_no_perm'));
									return false;
								}
								setShowUserCollectionCreate(true);
								setChosenUserCollection({});
							}}>
								<div className='icon'></div>
								<div className='text'>{t('user_collection.button_created_new')}</div>
							</div>
						</div>
					</div>

					<div className='monetization-block'>Google ad</div>
				</div>
			) : null}

			<div className='purchased-wrap all-wrap'>

				<div className='page-title'>{t('user_collection.heading_user_collected')}</div>

				<div className='page-content'>
					<table>
						<thead>
							<tr>
								<th className='left grow'>{t('user_collection.collected_th_name')}</th>
								<th className='right nowrap'>{t('user_collection.collected_th_price')}</th>
								<th className='right nowrap'>{t('user_collection.collected_th_status')}</th>
								<th className='center nowrap'>{t('user_collection.collected_th_actions')}</th>
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
										<td className='right nowrap'>{onSell ? t('user_collection.collected_cell_status_onsale') : t('user_collection.collected_cell_status_nosale')}</td>
										<td className='center'>
											<div className='edit nowrap' onClick={() => {
												setShowUserPurchasedAssetRelist(true);
												setChosenUserAsset(asset);
											}}>{t('user_collection.collected_cell_actions')}</div>
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
							sendAlert(t('user_collection.created_hint_no_perm'));
							return false;
						}
						setShowUserCollectionCreate(true);
						setChosenUserCollection({});
					}}>
						<div className='icon'></div>
						<div className='text'>{t('user_collection.button_created_new')}</div>
					</div>

					<div className='page-title'>{t('user_collection.heading_user_created')}</div>
					<div className='page-content'>
						<table>
							<thead>
								<tr>
									<th className='left grow'>{t('user_collection.created_th_name')}</th>
									<th className='right nowrap'>{t('user_collection.created_th_status')}</th>
									<th className='center nowrap'>{t('user_collection.created_th_actions')}</th>
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

											<td className='right nowrap'>{available ? t('user_collection.created_cell_status_open') : t('user_collection.created_cell_status_closed')}</td>

											<td className='center'>
												<div className='edit nowrap' onClick={() => {
													setShowUserCollectionUpdate(true);
													setChosenUserCollection(collection);
												}}>{t('user_collection.created_cell_actions')}</div>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>

					<div className='monetization-block'>Google ad</div>

					{/* {userCollections.length > 3 ? (
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
					) : null} */}
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