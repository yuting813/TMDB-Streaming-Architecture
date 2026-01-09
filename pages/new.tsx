import Head from 'next/head';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import Row from '@/components/Row';
import requests, { tmdbFetch, TmdbResponse } from '@/utils/request';
import Footer from '@/components/Footer';

interface Props {
	netflixOriginals: any[];
	trending: any[];
}

export default function NewPage({ netflixOriginals, trending }: Props) {
	return (
		<div className='flex flex-col min-h-screen'>
			<Head>
				<title>New & Popular - Stream</title>
			</Head>
			<Header />
			<main className='m-10 px-4 pt-24 flex-grow'>
				<section className='space-y-8'>
					<Row title='New & Popular' movies={netflixOriginals} orientation='poster' />
					<Row title='Trending Now' movies={trending} orientation='poster' />
				</section>
			</main>
			<Modal />
			<div className='w-full bottom-0'>
				<Footer />
			</div>
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
