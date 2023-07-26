import './Explore.sass';
import axios from 'axios';
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createGlobalState, useWindowSize } from 'react-use';
import { chunk, reduce, map } from 'underscore';
import Collapsible from 'react-collapsible';
import { IoChevronDown } from "react-icons/io5";
import { MdChevronLeft, MdChevronRight, MdDone, MdFilterListAlt } from "react-icons/md";
import Slider from 'react-slick';
import useAlert from '../hooks/useAlert';
import useModal from '../hooks/useModal';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { useTranslation } from 'react-i18next';
import Meta from '../components/Meta';

const useCheckboxState = createGlobalState({
	categories_art: false,
	categories_memberships: false,
	categories_gaming: false,
	categories_education: false, 
	toggles_isnew: false,
	toggles_onsale: false,
    toggles_sold: false,
});

const Checkbox = ({ label, varValue }) => {
    const [isChecked, setIsChecked] = useCheckboxState();
    return (
        <label>
            <span>
                <input type="checkbox" checked={isChecked[varValue]} onChange={() => setIsChecked((state) => ({ ...state, [varValue]: !isChecked[varValue] }))}/>
                { isChecked[varValue] ? <MdDone size={20} stroke='rgb(255, 255, 255)' fill='rgb(255, 255, 255)' /> : null }
            </span>
            <span>{label}</span>
        </label>
    );
};

function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <button className={className}>
            <MdChevronRight
                size={40}
                onClick={onClick}
            />
        </button>
    );
}

function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <button className={className}>
            <MdChevronLeft
                size={40}
                onClick={onClick}
            />
        </button>
    );
}

const Explore = () => {
    const { t, i18n } = useTranslation();
    const sortOptions = [
        { value: 'createdAtDescending', label: '由新到舊' },
        { value: 'createdAtAscending', label: '由舊到新' },
        { value: 'priceAscending', label: '價格由低到高' },
		{ value: 'priceDescending', label: '價格由高到低' },
    ];
    const { sendModal } = useModal();
    const { sendAlert } = useAlert();
    const [searchCollections, setSearchCollections] = useState([]);
    const [searchAssets, setSearchAssets] = useState([]);

    const sliderSettings = {
        dots: true,
        nextArrow: <NextArrow />, 
        prevArrow: <PrevArrow />,
        infinite: true,
        speed: 500,
        slidesToShow: Math.max(1, Math.min(3, searchCollections.length)),
        slidesToScroll: 1, 
        className: 'Carousel--dot CollectionSearchCarousel--carousel', 
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: Math.max(1, Math.min(2, searchCollections.length)),
                    slidesToScroll: 1,
                },
            },
        ],
    };
    const { width } = useWindowSize();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (width > 1024 && open) setOpen(false);
    }, [width, open]);

    const [checked, setChecked] = useCheckboxState();
    useEffect(() => {
        const nchecked = reduce(checked, (m, n) => m + n, 0);
        if (nchecked == 0 || nchecked == Object.keys(checked).length) {
            filterCollection();
        } else {
            const groupByFilter = Object.keys(checked).reduce((m, n) => {
                const nsplited = n.split('_');
                const category = nsplited[0];
                m[category] = m[category] ?? [];
                if (checked[n]) m[category].push(nsplited[1]);
                return m;
            }, {});
            filterCollection(groupByFilter);
        }
    }, [checked]);

    const filterCollection = (params = []) => {
		axios.get(`items/explore`, {
			params: params
		}).then((response) => {
			const message = response.data.message;
            const data = response.data.data;
			if (message === 'success') {
                // console.log(data);
                setSearchCollections(data.collections);
                setSearchAssets(data.assets);
			}
		}).catch((error) => {
			const message = error.response.data.message;
			sendAlert('Oops!', message);
		});
	}

    const pages = useMemo(() => {
		return chunk(searchAssets, 10);
	}, [searchAssets]);
    const [currentPage, setCurrentPage] = useState(1);
    const currentPageList = useMemo(() => {
		if (pages.length) {
            return searchAssets?.slice(0, currentPage * 10)
        }
		return [];
	}, [currentPage, pages]);
    const fetchMoreData = () => {
        if (currentPage * 10 >= searchAssets.length) {
            return;
        }
        setCurrentPage(currentPage + 1);
    };

    const onDismiss = () => {
        setOpen(false);
    }

    return (
        <>
            <Meta metaTitle='探索 | UniFunn 由你放 - 數位資產交易平台' metaDescription='' metaKeyword='' />
            <div style={{ marginBlock: '-40px' }}>
                <div className="explore--main">
                    <div className="explore--topbar">
                        <div className="explore--topbar-wrapper">
                            <div className="explore--topbar-actions">
                                <div className="explore--topbar-content">
                                    <button className='explore--filter-btn' type='button' onClick={() => setOpen(true)}>
                                        <div>
                                            <MdFilterListAlt size={20}/>
                                        </div>
                                        <div>篩選條件</div>
                                    </button>
                                    <BottomSheet 
                                        open={open}
                                        onDismiss={onDismiss}
                                        header={
                                            <h3 style={{ display: 'flex', fontWeight: 600, alignItems: 'center', justifyContent: 'center', marginBlock: '10px' }}>
                                                篩選條件
                                            </h3>
                                        }
                                        footer={
                                            <div className='rsbs--footer'>
                                                <button className='rsbs-close' onClick={onDismiss}>
                                                    關閉
                                                </button>
                                                <button className='rsbs-submit' onClick={onDismiss}>
                                                    完成
                                                </button>
                                            </div>
                                        }
                                    >
                                        <div className="rsbs--sheet-content">
                                            <Collapsible trigger={[<span key={0}>類別</span>, <IoChevronDown key={1}/>]} transitionTime={100} open={true} easing='ease'>
                                                <ul className="checkbox-list">
                                                    <li>
                                                        <Checkbox label='藝術' varValue='categories_art'/>
                                                    </li>
                                                    <li>
                                                        <Checkbox label='會員資格' varValue='categories_memberships'/>
                                                    </li>
                                                    <li>
                                                        <Checkbox label='遊戲' varValue='categories_gaming'/>
                                                    </li>
                                                    <li>
                                                        <Checkbox label='教育' varValue='categories_education'/>
                                                    </li>
                                                </ul>
                                            </Collapsible>
                                            <Collapsible trigger={[<span key={0}>狀態</span>, <IoChevronDown key={1}/>]} transitionTime={100} open={true} easing='ease'>
                                                <ul className="checkbox-list">
                                                    <li>
                                                        <Checkbox label='最近新增' varValue='toggles_isnew'/>
                                                    </li>
                                                    <li>
                                                        <Checkbox label='標售中' varValue='toggles_onsale'/>
                                                    </li>
                                                    <li>
                                                        <Checkbox label='已售出' varValue='toggles_sold'/>
                                                    </li>
                                                </ul>
                                            </Collapsible>
                                        </div>
                                    </BottomSheet>
                                    {/* <div className="ml-auto">
                                        <Select isSearchable={false} options={sortOptions} menuPlacement='top' placeholder="排序方式"/>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="explore--result">
                        <div className="explore--result-left-panel">
                            <div className="collapsible-container">
                                <Collapsible trigger={[<span key={0}>{t('explore.panel_category_title')}</span>, <IoChevronDown key={1}/>]} transitionTime={100} open={true} easing='ease'>
                                    <ul className="checkbox-list">
                                        <li>
                                            <Checkbox label={t('explore.panel_category_art')} varValue='categories_art'/>
                                        </li>
                                        <li>
                                            <Checkbox label={t('explore.panel_category_memberships')} varValue='categories_memberships'/>
                                        </li>
                                        <li>
                                            <Checkbox label={t('explore.panel_category_gaming')} varValue='categories_gaming'/>
                                        </li>
                                        <li>
                                            <Checkbox label={t('explore.panel_category_education')} varValue='categories_education'/>
                                        </li>
                                    </ul>
                                </Collapsible>
                                <Collapsible trigger={[<span key={0}>{t('explore.panel_status_title')}</span>, <IoChevronDown key={1}/>]} transitionTime={100} open={true} easing='ease'>
                                    <ul className="checkbox-list">
                                        <li>
                                            <Checkbox label={t('explore.panel_status_isnew')} varValue='toggles_isnew'/>
                                        </li>
                                        <li>
                                            <Checkbox label={t('explore.panel_status_onsale')} varValue='toggles_onsale'/>
                                        </li>
                                        <li>
                                            <Checkbox label={t('explore.panel_status_sold')} varValue='toggles_sold'/>
                                        </li>
                                    </ul>
                                </Collapsible>
                            </div>
                        </div>
                        <div className="explore--result-right-panel">
                            <div className="explore--result-collection">
                                <div className="explore--result-collection-carousel">
                                    <p>{t('explore.result_collection_title')}</p>
                                    <div className="carousel-container">
                                        <div style={{ width: '100%' }}>
                                            <Slider {...sliderSettings}>
                                                { 
                                                    searchCollections.map((value, index) => {
                                                    return (
                                                        <div key={index} className="carousel-card">
                                                            <Link to={`/collection/${ value.id }`} className="carousel-card-link">
                                                                <div className="carousel-card-container">
                                                                    <div className="carousel-card-figure">
                                                                        <span className="figure-wrapper">
                                                                            <img alt="" src={value.uri}/>
                                                                        </span>
                                                                    </div>
                                                                    <div className="carousel-card-content">
                                                                        <div className="card-thumbnail">
                                                                            <span className="thumbnail-wrapper">
                                                                                <img alt="" src={value.uri}/>
                                                                            </span>
                                                                        </div>
                                                                        <div className="card-text">
                                                                            <div>
                                                                                <div>{ value.fullName }</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>)
                                                    })
                                                }
                                            </Slider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="explore--result-numbers">{searchAssets?.length} {t('explore.result_items_title')}</div>
                            <div className="explore--result-asset">
                                <div>
                                    <InfiniteScroll
                                        className="grid-wrapper"
                                        dataLength={ currentPageList.length }
                                        next={fetchMoreData}
                                        hasMore={currentPageList.length < searchAssets.length}
                                    >
                                        {currentPageList.map((value, index) => {
                                            let avgValuePrice = map(value, (v) => v.valuePrice);
                                            avgValuePrice = avgValuePrice.reduce((memo, num) => memo + num, 0) / avgValuePrice.length || 1;
                                            return (<article key={index} onClick={() => sendModal(`${ value[0].transationHash }_Listings`, t('landing.third_section_card_listed_list_title'), value)}>
                                                <Link>
                                                    <div className="result-thumbnail">
                                                        <div style={{ inset: '0px', position: 'absolute' }}>
                                                            <div style={{ 
                                                                minHeight: 'inherit',
                                                                borderRadius: 'inherit',
                                                                height: '100%',
                                                                width: '100%',
                                                                position: 'relative' }}>
                                                                <div className="media-wrapper">
                                                                    <div className="media-animation">
                                                                        <div className="media-animation-wrapper">
                                                                            <div className="media-animation-img">
                                                                                <span>
                                                                                    <img alt="" src={value[0].uri}/>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="result-content">
                                                        <div className="result-title">
                                                            <div className="result-collection">
                                                                <div>{ value[0].collectionInfo.fullName }</div>
                                                            </div>
                                                            <div className="result-name">{ value[0].fullName }</div>
                                                        </div>
                                                        <div className="result-price">
                                                            <span className="result-price-text"><small>{t('explore.result_items_avg_price')}</small> <b>{ avgValuePrice } P</b></span>
                                                        </div>
                                                    </div>
                                                    
                                                </Link>
                                            </article>
                                        )})}
                                    </InfiniteScroll>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Explore;