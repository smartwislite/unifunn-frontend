import { useMemo } from 'react';
import { useWindowSize } from 'react-use';

const PrevArrow = (props) => {
	const { width } = useWindowSize();

	const distance = useMemo(() => {
		let dotSize;

		if (width > 1366) dotSize = 18;
		if (width <= 1366 && width >= 768) dotSize = Math.round(18 / 1366 * width);
		if (width < 768) dotSize = Math.round(18 / 375 * width);

		if (props.slidesToShow) {
			const numberOfDots = Math.ceil((props.slideLength || props.slideCount) / props.slidesToShow);
			return numberOfDots / 2 * dotSize;
		}

		return (props.slideLength || props.slideCount) / 2 * dotSize;
	}, [props.slideCount, props.slideLength, props.slidesToShow, width]);

	return (
		<svg className='slideArrow prev' style={{ right: `calc(50% + ${distance}px)` }} width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={props.onClick}>
			<mask id="path-1-inside-1_308_2793" fill="white">
				<path fillRule="evenodd" clipRule="evenodd" d="M8.69709 13.071L15.3439 6.42421L13.7197 6.5L7.00003 13.071L13.7651 19.7178H15.3439L8.69709 13.071Z" />
			</mask>
			<path fillRule="evenodd" clipRule="evenodd" d="M8.69709 13.071L15.3439 6.42421L13.7197 6.5L7.00003 13.071L13.7651 19.7178H15.3439L8.69709 13.071Z" fill="#2E5376" />
			<path className='changeFill' d="M15.3439 6.42421L15.288 5.22552L18.3841 5.08104L16.1924 7.27274L15.3439 6.42421ZM8.69709 13.071L7.84856 13.9195L7.00003 13.071L7.84856 12.2225L8.69709 13.071ZM13.7197 6.5L12.8807 5.64204L13.2074 5.3226L13.6637 5.3013L13.7197 6.5ZM7.00003 13.071L6.15901 13.927L5.28575 13.069L6.16104 12.2131L7.00003 13.071ZM13.7651 19.7178V20.9178H13.2742L12.924 20.5738L13.7651 19.7178ZM15.3439 19.7178L16.1924 18.8693L18.2409 20.9178L15.3439 20.9178V19.7178ZM16.1924 7.27274L9.54561 13.9195L7.84856 12.2225L14.4954 5.57568L16.1924 7.27274ZM13.6637 5.3013L15.288 5.22552L15.3998 7.62291L13.7756 7.6987L13.6637 5.3013ZM15.3439 20.9178H13.7651V18.5178H15.3439V20.9178ZM9.54561 12.2225L16.1924 18.8693L14.4954 20.5663L7.84856 13.9195L9.54561 12.2225ZM6.16104 12.2131L12.8807 5.64204L14.5587 7.35796L7.83902 13.929L6.16104 12.2131ZM12.924 20.5738L6.15901 13.927L7.84104 12.215L14.6061 18.8618L12.924 20.5738Z" fill="#BDBDBD" mask="url(#path-1-inside-1_308_2793)" />
		</svg>
	)
}

export default PrevArrow;