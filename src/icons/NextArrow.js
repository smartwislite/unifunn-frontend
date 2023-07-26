import { useMemo } from 'react';
import { useWindowSize } from 'react-use';

const NextArrow = (props) => {
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
		<svg className='slideArrow next' style={{ left: `calc(50% + ${distance}px)` }} width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={props.onClick}>
			<path className='changeFill' fillRule="evenodd" clipRule="evenodd" d="M16.7983 13.071L10.1515 6.42421L11.7757 6.5L18.4953 13.071L11.7303 19.7178H10.1515L16.7983 13.071Z" fill="#BDBDBD" />
		</svg>
	)
}

export default NextArrow;