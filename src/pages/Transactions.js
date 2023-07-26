import './user-pages.sass';
import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { sortBy, chunk, uniq, filter } from 'underscore';
import { useWindowSize } from 'react-use';
import useAlert from '../hooks/useAlert';
import Pagination from '../components/Pagination';
import selectArrow from '../assets/select-arrow.svg';


const Transactions = () => {
	const { sendAlert } = useAlert();
	const token = sessionStorage.getItem('token');
	const walletAddress = sessionStorage.getItem('walletAddress');
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		axios.get(`/token/getTransactions/${walletAddress}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		}).then((response) => {
			const message = response.data.message;
			const data = response.data.data;

			if (message === 'success') {
				setTransactions(sortBy(data, 'createdAt').reverse());
			}
		}).catch((error) => {
			const message = error.response.data.message;

			switch (message) {
				case 'No token is provided':
					sendAlert('權限不足', '請使用正確的方式取得資料');
					break;

				default:
					sendAlert('Oops! an unexpected error occurred', message);
					break;
			}
		});
	}, [token, walletAddress, sendAlert]);

	const alteredTransactions = useMemo(() => {
		return transactions.map((transaction) => {
			switch (transaction.transactionDetail) {

				case 'Mint':
					transaction.transactionDetail = '鑄造';
					break;

				case 'Payment':
					transaction.transactionDetail = '支付';
					break;

				case 'Delivery':
					transaction.transactionDetail = '發送';
					break;

				case 'Relist':
					transaction.transactionDetail = '上架';
					break;

				case 'Exchange':
					transaction.transactionDetail = '兌換';
					break;

				case 'Transfer':
					if (transaction.senderAddress === walletAddress) {
						transaction.transactionDetail = '轉出';
					}

					if (transaction.receiverAddress === walletAddress) {
						transaction.transactionDetail = '轉入';
					}
					break;
			}

			return transaction;
		});
	}, [transactions, walletAddress]);

	const [filterSelect, setFilter] = useState('all');

	const options = useMemo(() => {
		const unique = uniq(alteredTransactions, 'transactionDetail');

		return unique.map((item) => {
			return item.transactionDetail;
		});
	}, [alteredTransactions]);

	const filteredTransactions = useMemo(() => {
		if (filterSelect === 'all') return alteredTransactions;
		return filter(alteredTransactions, (transaction) => {
			return transaction.transactionDetail === filterSelect;
		})
	}, [filterSelect, alteredTransactions]);

	const [currentPage, setCurrentPage] = useState(1);

	const { width } = useWindowSize();

	const itemsPerPage = useMemo(() => {
		if (width >= 768) return 12;
		return 6;
	}, [width]);

	const pages = useMemo(() => {
		return chunk(filteredTransactions, itemsPerPage);
	}, [itemsPerPage, filteredTransactions]);

	const currentPageList = useMemo(() => {
		if (pages.length) return pages[currentPage - 1];
		return [];
	}, [currentPage, pages]);

	return (
		<div id='Transactions' className='user-pages'>
			<div className='page-title'>帳戶活動</div>

			<select className='filter' defaultValue={filterSelect} style={{ backgroundImage: `url(${selectArrow})` }} onChange={(e) => { setFilter(e.target.value) }}>
				<option value='all'>全部</option>

				{options.map((option) => {
					return (
						<option value={option} key={option}>{option}</option>
					)
				})}
			</select>

			<div className='page-content'>
				{currentPageList.length ? (
					<div className='table-wrap'>
						<table>
							<thead>
								<tr>
									<th>時間</th>
									<th>從</th>
									<th>到</th>
									<th>動作</th>
									<th>數量</th>
									<th>類型</th>
									<th>項目</th>
								</tr>
							</thead>

							<tbody>
								{currentPageList.map((transaction, index) => {
									const { transactionHash, senderAddress, receiverAddress, createdAt, transactionAmount, transactionType, transactionDetail, transactionRemark } = transaction;
									
									const date = new Date(createdAt).toLocaleString();

									let transactionTypeCHT = '', 
										transactionItem = '';

									switch (transactionType) {
										case 'nft':
											transactionTypeCHT = 'NFT';
											if (transactionRemark) {
												transactionItem = transactionRemark.split('/').slice(-1)[0]
											}
											break;
										case 'point':
											transactionTypeCHT = '點數';
											break;
										case 'currency':
											transactionTypeCHT = '線上支付';
											break;
									}

									return (
										<tr key={transactionHash + index}>
											<td>{date}</td>
											<td className={ `ellipsis ${senderAddress == walletAddress ? 'blue' : ''}`}>{senderAddress.slice(2, 8).toLocaleUpperCase()}</td>
											<td className={ `ellipsis ${receiverAddress == walletAddress ? 'blue' : ''}`}>{receiverAddress.slice(2, 8).toLocaleUpperCase()}</td>
											<td>{transactionDetail}</td>
											<td>{transactionAmount}</td>
											<td>{transactionTypeCHT}</td>
											<td className="ellipsis"><Link to={ `/collection/${transactionRemark}` }>{transactionItem.slice(0, 8).toLocaleUpperCase()}</Link></td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				) : (
					<div className='no-transactions'>尚無帳戶活動</div>
				)}

				<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageCount={pages.length} top={0} />
			</div>

			<div className='monetization-block'>Google ad</div>
		</div >
	)
}

export default Transactions;