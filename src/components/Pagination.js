import { useEffect, useCallback, useState } from 'react';
import './Pagination.sass';
import useGlobalState from '../GlobalStates';
import { useLocation } from 'react-router';
import PrevArrow from '../icons/PrevArrow';
import NextArrow from '../icons/NextArrow';

const Pagination = (props) => {
	const { currentPage, setCurrentPage, pageCount, top } = props;

	const [globalStates, setGlobalStates] = useGlobalState();
	const location = useLocation();

	useEffect(() => {
		if (location.pathname && globalStates[location.pathname]) {
			setCurrentPage(globalStates[location.pathname]);
		}
	}, [location.pathname, setCurrentPage, globalStates]);

	const [pages, setPages] = useState([]);

	const setGlobalPage = useCallback(
		(page) => {
			setGlobalStates({
				...globalStates,
				[location.pathname]: page,
			});
		},
		[globalStates, location.pathname, setGlobalStates]
	);

	const toTop = useCallback(() => {
		window.scrollTo({ top: top || 0, behavior: 'smooth' });
	}, [top]);

	const setPage = useCallback(
		(page) => {
			if (page !== currentPage) {
				setCurrentPage(page);
				setGlobalPage(page);
				toTop();
			}
		},
		[currentPage, setCurrentPage, setGlobalPage, toTop]
	);

	const prev3 = useCallback(() => {
		setPage(currentPage - 3);
	}, [currentPage, setPage]);

	const next3 = useCallback(() => {
		setPage(currentPage + 3);
	}, [currentPage, setPage]);

	useEffect(() => {
		const list = [];

		if (pageCount <= 6) {
			for (let index = 1; index <= pageCount; index++) {
				list.push({
					number: index,
					active: currentPage === index,
				});
			}
		}

		if (pageCount > 6) {
			list.push({
				number: 1,
				active: currentPage === 1,
			});

			if (currentPage > 3) {
				list.push({
					number: '...',
					active: false,
					onClick: prev3,
				});
			}

			if (currentPage < 3) {
				for (let index = 2; index < 5; index++) {
					list.push({
						number: index,
						active: currentPage === index,
					});
				}
			} else if (currentPage > pageCount - 2) {
				for (let index = pageCount - 3; index < pageCount; index++) {
					list.push({
						number: index,
						active: currentPage === index,
					});
				}
			} else {
				for (let index = currentPage - 1; index <= currentPage + 1; index++) {
					list.push({
						number: index,
						active: currentPage === index,
					});
				}
			}

			if (currentPage < pageCount - 2) {
				list.push({
					number: '...',
					active: false,
					onClick: next3,
				});
			}

			list.push({
				number: pageCount,
				active: currentPage === pageCount,
			});
		}

		setPages(list);
	}, [pageCount, currentPage, next3, prev3]);

	if (!pageCount) return null;

	const prevPage = () => {
		if (currentPage !== 1) {
			setCurrentPage(currentPage - 1);
			setGlobalPage(currentPage - 1);
			toTop();
		}
	};

	const nextPage = () => {
		if (currentPage !== pageCount) {
			setCurrentPage(currentPage + 1);
			setGlobalPage(currentPage + 1);
			toTop();
		}
	};

	return (
		<div className='Pagination'>
			<div className='center-wrap'>
				<div className='item prev' onClick={prevPage}>
					<PrevArrow />
				</div>

				{pages.map((page, index) => {
					const { number, active, onClick } = page;

					return (
						<div
							className={`item ${active && 'active'}`}
							key={index + number}
							onClick={() => {
								if (onClick) {
									onClick();
								} else {
									setPage(number);
								}
							}}>
							{number}
						</div>
					);
				})}

				<div className='item next' onClick={nextPage}>
					<NextArrow />
				</div>
			</div>
		</div>
	);
};

export default Pagination;
