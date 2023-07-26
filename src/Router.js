import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import UserLayout from './layouts/UserLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Wallet from './pages/Wallet';
import Transfer from './pages/Transfer';
import Transactions from './pages/Transactions';
import Exchange from './pages/Exchange';
import Upgrade from './pages/Upgrade';
import Account from './pages/Account';
import UserCollections from './pages/UserCollections';
import UserCollection from './pages/UserCollection';
import Collection from './pages/Collection';
import Asset from './pages/Asset';
import FAQ from './pages/FAQ';
import Explore from './pages/Explore';

const ProtectedRoute = ({ children }) => {
	const token = sessionStorage.getItem('token');

	if (!token) return <Navigate to="/" replace />;
	return children;
};

function Router() {
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/reset-password" element={<ResetPassword />} />

			<Route element={<MainLayout />}>
				<Route path="/" exact element={<Landing />} />
				<Route path="/collection/:collectionId" exact element={<Collection />} />
				<Route path="/collection/:collectionId/:assetId" exact element={<Asset />} />
				<Route path="/explore" element={ <Explore /> }/>
				<Route path="/FAQ" element={ <FAQ /> }/>
			</Route>

			<Route path="/user" element={
				<ProtectedRoute>
					<UserLayout />
				</ProtectedRoute>
			}>
				<Route path="wallet" exact element={<Wallet />} />
				<Route path="transfer" exact element={<Transfer />} />
				<Route path="transactions" exact element={<Transactions />} />
				<Route path="exchange" exact element={<Exchange />} />
				<Route path="upgrade" exact element={<Upgrade />} />
				<Route path="account" exact element={<Account />} />
				<Route path="collections" exact element={<UserCollections />} />
				<Route path="collections/:id" exact element={<UserCollection />} />
			</Route>
		</Routes>
	);
}

export default Router;
