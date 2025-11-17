import Head from 'next/head';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import Row from '@/components/Row';
import requests from '@/utils/request';

interface Props {
	netflixOriginals: any[];
	trending: any[];
}

export default function NewPage({ netflixOriginals, trending }: Props) {
	return (
		<div>
			<Head>
				<title>New & Popular</title>
			</Head>
			<Header />
			<main className='m-10 px-4 pt-24'>
				<h1 className='mb-10 text-3xl font-bold'>New & Popular</h1>
				<section className='space-y-8'>
					<Row title='New & Popular' movies={netflixOriginals} orientation='poster' />
					<Row title='Trending Now' movies={trending} orientation='poster' />
				</section>
			</main>
			<Modal />
		</div>
	);
}

export async function getStaticProps() {
	try {
		const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
		const BASE = 'https://api.themoviedb.org/3';

		const [netflixRes, trendingRes] = await Promise.all([
			fetch(requests.fetchNetflixOriginals).then((r) => r.json()),
			fetch(requests.fetchTrending).then((r) => r.json()),
		]);

		return {
			props: {
				netflixOriginals: netflixRes.results || [],
				trending: trendingRes.results || [],
			},
			revalidate: 3600,
		};
	} catch (error) {
		console.error('Error fetching TV data', error);
		return {
			props: { trending: [], topRated: [] },
			revalidate: 60,
		};
	}
}
