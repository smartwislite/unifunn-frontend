const textareaToHtml = (content) => {
	if (content) {
		return content
			.replace(/\r\n?/g, '\n')
			.replace(/[<>&"']/g, (a) => {
				switch (a) {
					case '<':
						return '&lt;';
					case '>':
						return '&gt;';
					case '&':
						return '&amp;';
					case '"':
						return '&quot;';
					case '\'':
						return '&apos;';
					default:
						return '';
				}
			})
			.replace(/\n/g, '<br />');
	}
	return '';
};

export default textareaToHtml;