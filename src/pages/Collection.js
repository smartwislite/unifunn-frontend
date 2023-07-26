import './Landing.sass';
import { useMemo, useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import selectArrow from '../assets/select-arrow.svg';
// import imagePreview from '../assets/image-preview.svg';
import Pagination from '../components/Pagination';
import { chunk, map } from 'underscore';
import { useWindowSize } from 'react-use';
import useAssets from '../hooks/useAssetsBatch';
import useCollection from '../hooks/useCollection';
import useCheckVideo from '../hooks/useCheckVideo';
import textareaToHtml from '../tools/textareaToHtml';
import useModal from '../hooks/useModal';
import { useTranslation } from 'react-i18next';

const Nft = ({ nft }) => {
	const { t, i18n } = useTranslation();
	const { sendModal } = useModal();
	const { isVideo, checkForVideo } = useCheckVideo();
	const loggedAddress = sessionStorage.getItem('walletAddress');

	useEffect(() => {
		if (nft[0].uri) checkForVideo(nft[0].uri);
	}, [nft[0].uri, checkForVideo]);

	let navLink = nft.length > 1 ? `/collection/${ nft[0].collectionId }` : `/collection/${ nft[0].collectionId }/${ nft[0].id }`, 
		subscribeOnly = !nft[0].collectionInfo.subscribeOnly || [nft[0].creatorInfo.walletAddress, nft[0].ownerInfo.walletAddress].includes(loggedAddress), 
		coverImage = subscribeOnly ? nft[0].uri : nft[0].collectionInfo.uri, 
		nftName = nft[0].fullName;

	let avgValuePrice = map(nft, (v) => v.valuePrice);
		avgValuePrice = avgValuePrice.reduce((memo, num) => memo + num, 0) / avgValuePrice.length || 1;

	const content = <>
	<div className='zoom-wrapper'>
		<div className='cover' style={{ backgroundImage: `url(${coverImage})` }}>
			{subscribeOnly ? (
				isVideo ? (
					<video src={ `${nft[0].uri}#t=0.15`} preload='metadata' muted></video>
				) : null
			) : (<span>Subscriber Only</span>)}
		</div>
	</div>
	<div className='info-wrap'>
		<div className='row margin'>
			<div className='nft-name'> {nftName}</div>
		</div>
		<div className='row flex-between'>
			<div className='price'>
				{avgValuePrice} P
			</div>
			<div className='stock'>
				{t('landing.third_section_card_listed_text_items')} <b>{ nft.length > 1 ? (
					`${ nft.length }/${ nft[0].parentAmount }`
				) : nft.length}</b>
			</div>
		</div>
	</div>
	</>

	return (
		<div className='item'>
			<div className='content'>
				{ nft.length > 1 ? (
					<div className="listings" onClick={(e) => { e.stopPropagation(); sendModal(`${ nftName }_Listings`, t('landing.third_section_card_listed_list_title'), nft); }}>{ content }</div>) : (
					<Link to={ navLink }>{ content }</Link>
				) }
			</div>
		</div>
	)
}

const Collection = () => {

	const { t, i18n } = useTranslation();

	const { collectionId } = useParams();
	const { collection, getCollection } = useCollection();
	const { assetsBatch: assets, getAssetsBatch: getAssets } = useAssets();
	const [sort, setSort] = useState('createdAtDescending');
	const [currentPage, setCurrentPage] = useState(1);
	const { width } = useWindowSize();
	const nftSection = useRef();
	const [nftSectionTop, setNftSectionTop] = useState(0);
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortDirection, setSortDirection] = useState('ASC');
	const dateFormatter = new Intl.DateTimeFormat(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' });

	useEffect(() => {
		if (collectionId && getCollection) getCollection(collectionId);
	}, [collectionId, getCollection]);

	useEffect(() => {
		getAssets({ sortBy, sortDirection, collectionId, groupBy: 1 });
	}, [sortBy, sortDirection, getAssets, collectionId]);

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

	useEffect(() => {
		let offset;

		if (width > 1366) offset = 75;
		if (width <= 1366 && width >= 768) offset = Math.round(75 / 1366 * width);
		if (width < 768) offset = Math.round(50 / 375 * width);

		setNftSectionTop(nftSection?.current?.offsetTop - offset);
	}, [nftSection?.current?.offsetTop, width]);

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

	const descriptions = {
		[t('collection.unique_items')]: collection.id ? collection.uniqueTokens.length : 0, 
		[t('collection.total_items')]: collection.id ? `${ collection.onSellAmount }/${ collection.totalCount }` : '', 
		[t('collection.created')]: collection.id ? dateFormatter.format(new Date(collection.createdAt)) : ''
	};

	return (
		<div id='Collection'>
			<section className='spotlight'>
				<div className='slider-wrap'>
					<div className='image' style={{ backgroundImage: `url(${collection.uri})` }}></div>
				</div>

				<div className='intro v-center'>
					<h1>{collection.fullName}</h1>
					<div className='description'>{t('collection.by')} <b>{ collection.id ? `${collection.creatorAddress.slice(2, 8).toLocaleUpperCase()}`: '' }</b></div>
					{/* <div className='description'>{ collection.id ? `項目總數：${ collection.onSellAmount }/${ collection.totalCount }  ·  建立日期：${ dateFormatter.format(new Date(collection.createdAt)) }` : ''}</div> */}
					<div className='description-wrapper'>
						{ Object.entries(descriptions).map(([k, v], i) => (
						<div key={i} className='description'>
							{ k }：{ v }
						</div>)) }
					</div>
					<p className='description' dangerouslySetInnerHTML={{ __html: textareaToHtml(collection.description) }}></p>
				</div>
			</section>

			<div className='monetization-block'>Google ad { collection.subscribeOnly ? 'subscribeOnly' : 'everyone' }</div>

			<section className='nfts' ref={nftSection}>
				<h2>NFT</h2>

				<div className='controls'>
					<div className='select-wrap'>
						<select defaultValue={sort} style={{ backgroundImage: `url(${selectArrow})` }} onChange={(e) => { setSort(e.target.value) }}>
							<option value='createdAtDescending'>{t('landing.third_section_select_sort_new_old')}</option>
							<option value='createdAtAscending'>{t('landing.third_section_select_sort_old_new')}</option>
							<option value='priceDescending'>{t('landing.third_section_select_sort_high_low')}</option>
							<option value='priceAscending'>{t('landing.third_section_select_sort_low_high')}</option>
						</select>
					</div>
				</div>

				<div className='list-wrap'>
					{currentPageList?.map((nft, index) => {
						return (
							<Nft key={ `NFT_${index}`} nft={nft} />
						)
					})}
				</div>

				<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageCount={pages.length} top={nftSectionTop} />
			</section>

			<div className='monetization-block'>Google ad</div>
		</div>
	);
};

export default Collection;
