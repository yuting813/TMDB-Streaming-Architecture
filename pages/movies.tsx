import Head from 'next/head';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import Row from '@/components/Row';
import { Movie } from '@/typings';
import requests, { tmdbFetch, TmdbResponse } from '@/utils/request';

interface Props {
	topRated: Movie[];
	action: Movie[];
	comedy: Movie[];
}

export default function MoviesPage({ topRated, action, comedy }: Props) {
	return (
		<div className='flex min-h-screen flex-col'>
			<Head>
				<title>Movies - Stream</title>
			</Head>
			<Header />
			<main className='m-10 flex-grow px-4 pt-24'>
				<section className='space-y-8'>
					<Row title='Top Rated' movies={topRated} orientation='poster' />
					<Row title='Action Movies' movies={action} orientation='poster' />
					<Row title='Comedies' movies={comedy} orientation='poster' />
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
		const [topRatedRes, actionRes, comedyRes] = await Promise.all([
			tmdbFetch<TmdbResponse<Movie>>(requests.fetchTopRated, { params: { language: 'en-US' } }),
			tmdbFetch<TmdbResponse<Movie>>(requests.fetchActionMovies, { params: { language: 'en-US' } }),
			tmdbFetch<TmdbResponse<Movie>>(requests.fetchComedyMovies, { params: { language: 'en-US' } }),
		]);

		return {
			props: {
				topRated: topRatedRes?.results ?? [],
				action: actionRes?.results ?? [],
				comedy: comedyRes?.results ?? [],
			},
			revalidate: 3600,
		};
	} catch (error) {
		console.error('Error fetching movie data', error);
		return { props: { topRated: [], action: [], comedy: [] }, revalidate: 60 };
	}
}
