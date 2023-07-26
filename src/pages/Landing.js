import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import './Landing.sass';
import Slider from 'react-slick';
import { sampleNfts } from '../tools/fakeData';
import { Link } from 'react-router-dom';
import PrevArrow from '../icons/PrevArrow';
import NextArrow from '../icons/NextArrow';
import selectArrow from '../assets/select-arrow.svg';
import imagePreview from '../assets/image-preview.svg';
import Pagination from '../components/Pagination';
import { chunk } from 'underscore';
import { useWindowSize } from 'react-use';
import useCollections from '../hooks/useCollections';
import useAssets from '../hooks/useAssetsBatch';
import useCheckVideo from '../hooks/useCheckVideo';
import useModal from '../hooks/useModal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-tw';
import { useTranslation } from 'react-i18next';

function getSpotlightNfts(nfts, n) {
	if (nfts === undefined) return [];
	const shuffled = [...nfts].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
}

const Nft = ({ nft }) => {
	const { t, i18n } = useTranslation();

	const { isVideo, checkForVideo } = useCheckVideo();
	const { sendModal } = useModal();
	const loggedAddress = sessionStorage.getItem('walletAddress');

	useEffect(() => {
		if (nft[0].uri) checkForVideo(nft[0].uri);
	}, [nft[0].uri, checkForVideo]);

	const uniqueOwners = [...new Set(nft.map((v, i) => v.creatorInfo.walletAddress))].concat([...new Set(nft.map((v, i) => v.ownerInfo.walletAddress))]);

	let navLink = nft.length > 1 ? `/collection/${ nft[0].collectionId }` : `/collection/${ nft[0].collectionId }/${ nft[0].id }`, 
		subscribeOnly = !nft[0].collectionInfo.subscribeOnly || uniqueOwners.includes(loggedAddress), 
		coverImage = subscribeOnly ? nft[0].uri : nft[0].collectionInfo.uri, 
		collectionName = nft[0].collectionInfo.fullName, 
		nftName = nft[0].fullName;

	const content = <>
	<div className='zoom-wrapper'>
		<div className='cover' style={{ backgroundImage: `url(${coverImage})` }}>
			{subscribeOnly ? (
				isVideo ? (
					<video src={ `${nft[0].uri}#t=0.15`} preload='metadata' muted></video>
				) : null
			) : (<span>{t('landing.third_section_card_subscriber_only')}</span>)}
		</div>
	</div>
	<div className='info-wrap'>
		<div className='row margin'>
			<div className='info-collection-name'> {collectionName} </div>
			<div className='nft-name'> {nftName} </div>
		</div>
		<div className='row flex-between'>
			<div className='price'>
				{nft[0].valuePrice} P
			</div>
			<div className='stock'>
				{t('landing.third_section_card_listed_text_items')} <b>{ nft.length > 1 ? (
					`${ nft.length }/${ nft[0].parentAmount }`
				) : nft.length}</b>
			</div>
		</div>
	</div>
	</>;

	return (
		<div className='item'>
			<div className='content'>
				{ nft.length > 1 ? (
					<div className="listings" onClick={() => sendModal(`${ nftName }_Listings`, t('landing.third_section_card_listed_list_title'), nft)}>{ content }</div>) : (
					<Link to={ navLink }>{ content }</Link>
				) }
			</div>
		</div>
	)
}

const Prev = (props) => {
	return <PrevArrow {...props} />;
};

const Next = (props) => {
	return <NextArrow {...props} />;
};

const Landing = () => {

	const _ = require('lodash');
	const { t, i18n } = useTranslation();
	dayjs.extend(relativeTime);
	dayjs.locale(i18n.language);

	const { collections } = useCollections();
	const { assetsBatch: assets, getAssetsBatch: getAssets } = useAssets();

	const spotlightSettings = useMemo(() => {
		return {
			arrows: true,
			prevArrow: <Prev />,
			nextArrow: <Next />,
			autoplay: true,
			autoplaySpeed: 8000,
			infinite: true,
			fade: true,
			speed: 1000,
			dots: true,
			customPaging: function (i) {
				return (
					<div className='nav-dot'>
						<div className='dot'></div>
					</div>
				);
			},
		};
	}, []);

	const spotlightNfts = useMemo(() => {
		return sampleNfts(4)
	}, []);

	const collectionsSettings = useMemo(() => {
		const slidesToShow = Math.min(4, collections.length);
		return {
			arrows: true,
			prevArrow: <Prev slidesToShow={slidesToShow} slideLength={collections.length} />,
			nextArrow: <Next slidesToShow={slidesToShow} slideLength={collections.length} />,
			autoplay: false,
			infinite: true,
			speed: 1000,
			dots: true,
			customPaging: function () {
				return (
					<div className='nav-dot'>
						<div className='dot'></div>
					</div>
				);
			},
			slidesToShow: slidesToShow,
			slidesToScroll: slidesToShow,
			responsive: [
				{
					breakpoint: 766,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
					},
				},
			],
		};
	}, [collections.length]);

	const [filter, setFilter] = useState('all');
	const [sort, setSort] = useState('createdAtDescending');
	const [currentPage, setCurrentPage] = useState(1);

	const { width } = useWindowSize();

	const itemsPerPage = useMemo(() => {
		if (width >= 768) return 12;
		return 6;
	}, [width]);

	const pages = useMemo(() => {
		return chunk(assets, itemsPerPage);
	}, [itemsPerPage, assets]);

	const currentPageList = useMemo(() => {
		if (pages.length) return pages[currentPage - 1];
		return [];
	}, [currentPage, pages]);

	const nftSection = useRef();

	const [nftSectionTop, setNftSectionTop] = useState(0);

	useEffect(() => {
		let offset;

		if (width > 1366) offset = 75;
		if (width <= 1366 && width >= 768) offset = Math.round(75 / 1366 * width);
		if (width < 768) offset = Math.round(50 / 375 * width);

		setNftSectionTop(nftSection?.current?.offsetTop - offset);
	}, [nftSection?.current?.offsetTop, width]);

	const [sortBy, setSortBy] = useState('createdAt');
	const [sortDirection, setSortDirection] = useState('ASC');
	const [filterCollection, setFilterCollection] = useState('');

	useEffect(() => {
		switch (sort) {
			case 'createdAtAscending':
				setSortBy('createdAt');
				setSortDirection('ASC');
				break;

			case 'createdAtDescending':
				setSortBy('createdAt');
				setSortDirection('DESC');
				break;

			case 'priceAscending':
				setSortBy('valuePrice');
				setSortDirection('ASC');
				break;

			case 'priceDescending':
				setSortBy('valuePrice');
				setSortDirection('DESC');
				break;
		}
	}, [sort]);

	useEffect(() => {
		switch (filter) {
			case 'all':
				setFilterCollection('');
				break;

			default:
				setFilterCollection(filter);
				break;
		}
	}, [filter]);

	useEffect(() => {
		getAssets({ sortBy, sortDirection, collectionId: filterCollection, groupBy: 1 });
	}, [sortBy, sortDirection, filterCollection, getAssets]);

	return (
		<div id='Landing'>
			<section className='spotlight'>
				<div className='slider-wrap'>
					<Slider className='slider' {...spotlightSettings}>
						{getSpotlightNfts(collections, 4).map((nft, index) => {
							return (
								<div className='slide' key={nft.id + index}>
									<div className='image-wraper' to={`/collection/${nft.id}`} >
										<img src={nft.uri} alt='' />
									</div>
									<div className='collection-name'>{t('landing.first_section_title')}</div>
									<div className='nft-name'>{nft.fullName}</div>
								</div>
							);
						})}
					</Slider>
				</div>

				<div className='intro'>
					<h1 className="title">
						<div className="text">數位商品 由你放</div>
						<div className="text">商機無限 UniFunn</div>
					</h1>
					<p className="description">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</div>
			</section>

			<section className='collections'>
				<h2>{t('landing.second_section_title')}</h2>

				<div className='slider-wrap'>
					{collections?.length ? (
						<Slider className='slider' {...collectionsSettings}>
							{ collections.map((collection, index) => {
								return (
									<div className='slide' key={collection.id + index}>
										<Link to={`/collection/${collection.id}`}>
											<div className='content'>
												<div className='zoom-wrapper'>
													<div className='cover' style={{ backgroundImage: `url(${collection.uri})` }}/>
												</div>
												<div className='info-wrap'>
													<div className='name'>{collection.fullName}</div>
													{/* <div className='description'>由：{collection.creatorAddress}</div> */}
													<div className='flex'>
														<div className='flex-column'>
															<span className='info-title'>{t('landing.second_section_text_items')}</span>
															<span className='info-content'>{collection.onSellAmount}/{collection.totalCount}</span>
														</div>
														<div className='flex-column'>
															<span className='info-title'>{t('landing.second_section_text_date')}</span>
															<span className='info-content'>{dayjs(collection.createdAt).fromNow()}</span>
														</div>
													</div>
												</div>
											</div>
										</Link>
									</div>
								);
							}) }
						</Slider>
					) : null}
				</div>
			</section>

			<div className='monetization-block'>Google ad</div>

			<section className='nfts' ref={nftSection}>
				<h2>{t('landing.third_section_title')}</h2>

				<div className='controls'>
					<div className='select-wrap'>
						<select defaultValue={filter} style={{ backgroundImage: `url(${selectArrow})` }} onChange={(e) => { setFilter(e.target.value) }}>
							<option value='all'>{t('landing.third_section_select_cat_all')}</option>
							{collections.map((collection, index) => {
								return (
									<option value={collection.id} key={collection.id + index + 'option'}>{collection.fullName}</option>
								)
							})}
						</select>
					</div>

					<div className='select-wrap'>
						<select defaultValue={sort} style={{ backgroundImage: `url(${selectArrow})` }} onChange={(e) => { setSort(e.target.value) }}>
							<option value='createdAtDescending'>{t('landing.third_section_select_sort_new_old')}</option>
							<option value='createdAtAscending'>{t('landing.third_section_select_sort_old_new')}</option>
							<option value='priceDescending'>{t('landing.third_section_select_sort_high_low')}</option>
							<option value='priceAscending'>{t('landing.third_section_select_sort_low_high')}</option>
							{/* <option value='stockAscending'>可購買數量：從多到少</option>
							<option value='stockDescending'>可購買數量：從少到多</option> */}
						</select>
					</div>
				</div>

				<div className='list-wrap'>
					{currentPageList?.map((nft, index) => {
						return (
							<Nft key={index} nft={nft} />
						)
					})}
				</div>

				<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageCount={pages.length} top={nftSectionTop} />
			</section>

			<div className='monetization-block'>Google ad</div>
		</div>
	);
};

export default Landing;
