import Head from 'next/head';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import Row from '@/components/Row';
import requests, { tmdbFetch, TmdbResponse } from '@/utils/request';

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
		const [netflixRes, trendingRes] = await Promise.all([
			tmdbFetch<TmdbResponse<any>>(requests.fetchNetflixOriginals, { params: { language: 'en-US' } }),
			tmdbFetch<TmdbResponse<any>>(requests.fetchTrending, { params: { language: 'en-US' } }),
		]);

		return {
			props: {
				netflixOriginals: netflixRes?.results ?? [],
				trending: trendingRes?.results ?? [],
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
