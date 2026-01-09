import Head from 'next/head';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import Row from '@/components/Row';
import requests, { tmdbFetch, TmdbResponse } from '@/utils/request';

interface Props {
	streamOriginals: any[];
	trending: any[];
}

export default function NewPage({ streamOriginals, trending }: Props) {
	return (
		<div className='flex min-h-screen flex-col'>
			<Head>
				<title>New & Popular - Stream</title>
			</Head>
			<Header />
			<main className='m-10 flex-grow px-4 pt-24'>
				<section className='space-y-8'>
					<Row title='New & Popular' movies={streamOriginals} orientation='poster' />
					<Row title='Trending Now' movies={trending} orientation='poster' />
				</section>
			</main>
			<Modal />
			<div className='bottom-0 w-full'>
				<Footer />
			</div>
		</div>
	);
}

export async function getStaticProps() {
	try {
		const [streamRes, trendingRes] = await Promise.all([
			tmdbFetch<TmdbResponse<any>>(requests.fetchstreamOriginals, {
				params: { language: 'en-US' },
			}),
			tmdbFetch<TmdbResponse<any>>(requests.fetchTrending, { params: { language: 'en-US' } }),
		]);

		return {
			props: {
				streamOriginals: streamRes?.results ?? [],
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
