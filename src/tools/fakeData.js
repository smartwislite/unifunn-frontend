import demo1 from './demoAssets/demo1.jpg';
import demo2 from './demoAssets/demo2.jpg';
import demo3 from './demoAssets/demo3.jpg';
import demo4 from './demoAssets/demo4.jpg';
import demo5 from './demoAssets/demo5.jpg';
import demo6 from './demoAssets/demo6.jpg';
import demo7 from './demoAssets/demo7.jpg';
import demo8 from './demoAssets/demo8.jpg';
import demo9 from './demoAssets/demo9.jpg';
import demo10 from './demoAssets/demo10.jpg';
import demo11 from './demoAssets/demo11.jpg';
import demo12 from './demoAssets/demo12.jpg';

import { sample, flatten, filter } from 'underscore';

const collections = [
	{
		id: 'c1',
		uri: demo1,
		fullName: '系列一',
		title: '系列標題系列標題',
		description: '系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。',
	},
	{
		id: 'c2',
		uri: demo5,
		fullName: '系列二',
		title: '系列標題系列標題',
		description: '系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。',
	},
	{
		id: 'c3',
		uri: demo9,
		fullName: '系列三',
		title: '系列標題系列標題',
		description: '系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。系列介紹，系列介紹。',
	},
];

const nfts = [
	{
		id: 'c1n1',
		collectionId: 'c1',
		collectionName: '系列一',
		image: demo2,
		name: '系列一收藏品一',
		description: '收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。',
		price: 30,
		stock: 0,
	},
	{
		id: 'c1n2',
		collectionId: 'c1',
		collectionName: '系列一',
		image: demo3,
		name: '系列一收藏品二',
		description: '收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。',
		price: 800,
		stock: 99,
	},
	{
		id: 'c1n3',
		collectionId: 'c1',
		collectionName: '系列一',
		image: demo4,
		name: '系列一收藏品三',
		description: '收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。',
		price: 9990,
		stock: 120,
	},
	{
		id: 'c2n1',
		collectionId: 'c2',
		collectionName: '系列二',
		image: demo6,
		name: '系列二收藏品一',
		description: '收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。',
		price: 33,
		stock: 3,
	},
	{
		id: 'c2n2',
		collectionId: 'c2',
		collectionName: '系列二',
		image: demo7,
		name: '系列二收藏品二',
		description: '收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。',
		price: 100,
		stock: 559,
	},
	{
		id: 'c2n3',
		collectionId: 'c2',
		collectionName: '系列二',
		image: demo8,
		name: '系列二收藏品三',
		description: '收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。',
		price: 28,
		stock: 0,
	},
	{
		id: 'c3n1',
		collectionId: 'c3',
		collectionName: '系列三',
		image: demo10,
		name: '系列三收藏品一',
		description: '收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。',
		price: 37484,
		stock: 938,
	},
	{
		id: 'c3n2',
		collectionId: 'c3',
		collectionName: '系列三',
		image: demo11,
		name: '系列三收藏品二',
		description: '收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。',
		price: 8379,
		stock: 9898,
	},
	{
		id: 'c3n3',
		collectionId: 'c3',
		collectionName: '系列三',
		image: demo12,
		name: '系列三收藏品三',
		description: '收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。收藏品介紹，收藏品介紹。',
		price: 77,
		stock: 0,
	},
];

const sampleCollections = (count) => {
	if (count <= collections.length) return sample(collections, count);

	const multiplier = Math.ceil(count / collections.length);

	const newArray = [];

	for (let index = 0; index < multiplier; index++) {
		newArray.push(collections);
	}

	return sample(flatten(newArray), count);
}

const sampleNfts = (count, collectionId) => {
	let pool = nfts;

	if (collectionId) {
		pool = filter(nfts, (nft) => {
			return nft.collectionId === collectionId;
		});
	}

	if (count <= pool.length) return sample(pool, count);

	const multiplier = Math.ceil(count / pool.length);

	const newArray = [];

	for (let index = 0; index < multiplier; index++) {
		newArray.push(pool);
	}

	return sample(flatten(newArray), count);
}

export {
	collections,
	nfts,
	sampleCollections,
	sampleNfts,
}