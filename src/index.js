import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import './index.sass';
import axios from 'axios';
import Alert from './components/Alert';
import Confirm from './components/Confirm';
import Modal from './components/Modal';
// import MetaTags from './components/Meta';

import './i18n';

axios.defaults.baseURL = 'http://59.124.106.166:3345/api/v2';

function Loading() {
	return <span>Loading...</span>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		{/* <MetaTags /> */}
		<Router />
		<Alert />
		<Confirm />
		<Modal />
	</BrowserRouter>
);