import React from 'react';
// import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import './index.sass';
import axios from 'axios';
import Alert from './components/Alert';
import Confirm from './components/Confirm';
import Modal from './components/Modal';

import './i18n';

axios.defaults.baseURL = 'http://api.unifunn.com/api/v2';

function Loading() {
	return <span>Loading...</span>;
}

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<Router />
		<Alert />
		<Confirm />
		<Modal />
	</BrowserRouter>
);
