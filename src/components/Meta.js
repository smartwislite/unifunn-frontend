import MetaTags from 'react-meta-tags';

const Meta = (props) => {

	if (!props.data) return null;

	const { metaDescription, metaKeyword, metaTitle } = props.data;

	return (
		<MetaTags>
			<title>{metaTitle}</title>
			<meta name='description' content={metaDescription} />
			<meta name='keywords' content={metaKeyword} />
			<meta property='og:title' content={metaTitle} />
			<meta property='og:description' content={metaDescription} />
		</MetaTags>
	);
};

export default Meta;
