import './Explore.sass';
import { Suspense, useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createGlobalState, useWindowSize } from 'react-use';
import { chunk } from 'underscore';
import Select from 'react-select';
import Collapsible from 'react-collapsible';
import { IoChevronDown, IoFilter } from "react-icons/io5";
import { MdChevronLeft, MdChevronRight, MdDone, MdFilterListAlt } from "react-icons/md";
import Slider from 'react-slick';
import { sampleNfts } from '../tools/fakeData';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css'

const useCheckboxState = createGlobalState({
	classArt: false,
	classMembership: false,
	classGame: false,
	classEducation: false, 
	statusRecent: false,
	statusSale: false,
    statusSold: false,
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
    
    const sortOptions = [
        { value: 'createdAtDescending', label: '由新到舊' },
        { value: 'createdAtAscending', label: '由舊到新' },
        { value: 'priceAscending', label: '價格由低到高' },
		{ value: 'priceDescending', label: '價格由高到低' },
    ];

    const sliderSettings = {
        dots: true,
        nextArrow: <NextArrow />, 
        prevArrow: <PrevArrow />,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1, 
        className: 'Carousel--dot CollectionSearchCarousel--carousel', 
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
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

    const [searchCollections, setSearchCollections] = useState([]);
    useEffect(() => {
        setSearchCollections(sampleNfts(7));
    }, []);

    const [searchAssets, setSearchAssets] = useState([]);
    useEffect(() => {
        setSearchAssets(sampleNfts(33));
    }, []);

    const pages = useMemo(() => {
		return chunk(searchAssets, 10);
	}, [searchAssets]);
    const [currentPage, setCurrentPage] = useState(1);
    const currentPageList = useMemo(() => {
		if (pages.length) {
            return searchAssets.slice(0, currentPage * 10)
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
                                    <div style={{ marginTop: '5px' }}>篩選條件</div>
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
                                                    <Checkbox label='藝術' varValue='classArt'/>
                                                </li>
                                                <li>
                                                    <Checkbox label='會員資格' varValue='classMembership'/>
                                                </li>
                                                <li>
                                                    <Checkbox label='遊戲' varValue='classGame'/>
                                                </li>
                                                <li>
                                                    <Checkbox label='教育' varValue='classEducation'/>
                                                </li>
                                            </ul>
                                        </Collapsible>
                                        <Collapsible trigger={[<span key={0}>狀態</span>, <IoChevronDown key={1}/>]} transitionTime={100} open={true} easing='ease'>
                                            <ul className="checkbox-list">
                                                <li>
                                                    <Checkbox label='最新' varValue='statusRecent'/>
                                                </li>
                                                <li>
                                                    <Checkbox label='標售中' varValue='statusSale'/>
                                                </li>
                                                <li>
                                                    <Checkbox label='已售出' varValue='statusSold'/>
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
                            <Collapsible trigger={[<span key={0}>類別</span>, <IoChevronDown key={1}/>]} transitionTime={100} open={true} easing='ease'>
                                <ul className="checkbox-list">
                                    <li>
                                        <Checkbox label='藝術' varValue='classArt'/>
                                    </li>
                                    <li>
                                        <Checkbox label='會員資格' varValue='classMembership'/>
                                    </li>
                                    <li>
                                        <Checkbox label='遊戲' varValue='classGame'/>
                                    </li>
                                    <li>
                                        <Checkbox label='教育' varValue='classEducation'/>
                                    </li>
                                </ul>
                            </Collapsible>
                            <Collapsible trigger={[<span key={0}>狀態</span>, <IoChevronDown key={1}/>]} transitionTime={100} open={true} easing='ease'>
                                <ul className="checkbox-list">
                                    <li>
                                        <Checkbox label='最新' varValue='statusRecent'/>
                                    </li>
                                    <li>
                                        <Checkbox label='標售中' varValue='statusSale'/>
                                    </li>
                                    <li>
                                        <Checkbox label='已售出' varValue='statusSold'/>
                                    </li>
                                </ul>
                            </Collapsible>
                        </div>
                    </div>
                    <div className="explore--result-right-panel">
                        <div className="explore--result-collection">
                            <div className="explore--result-collection-carousel">
                                <p>作品集結果</p>
                                <div className="carousel-container">
                                    <div style={{ width: '100%' }}>
                                        <Slider {...sliderSettings}>
                                            { searchCollections.map((value, index) => {
                                                return (
                                                    <div key={index} className="carousel-card">
                                                        <Link to="" className="carousel-card-link">
                                                            <div className="carousel-card-container">
                                                                <div className="carousel-card-figure">
                                                                    <span className="figure-wrapper">
                                                                        <img alt="" src={value.image}/>
                                                                    </span>
                                                                </div>
                                                                <div className="carousel-card-content">
                                                                    <div className="card-thumbnail">
                                                                        <span className="thumbnail-wrapper">
                                                                            <img alt="" src={value.image}/>
                                                                        </span>
                                                                    </div>
                                                                    <div className="card-text">
                                                                        <div>
                                                                            <div>{ value.collectionName }</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>)
                                                })}
                                        </Slider>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="explore--result-numbers">{searchAssets?.length} 個物品</div>
                        <div className="explore--result-asset">
                            <div >
                                <InfiniteScroll
                                    className="grid-wrapper"
                                    dataLength={ currentPageList.length }
                                    next={fetchMoreData}
                                    hasMore={currentPageList.length < searchAssets.length}
                                >
                                    {currentPageList.map((value, index) => (
                                        <article key={index}>
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
                                                                                <img alt="" src={value.image}/>
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
                                                            <div>{ value.collectionName }</div>
                                                        </div>
                                                        <div className="result-name">{ value.name.slice(3) }</div>
                                                    </div>
                                                    <div className="result-price">
                                                        <div className="result-price-text">{ value.price } P</div>
                                                    </div>
                                                </div>
                                                
                                            </Link>
                                        </article>
                                    ))}
                                </InfiniteScroll>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Explore;