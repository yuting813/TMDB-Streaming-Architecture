import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import Thumbnail from '@/components/Thumbnail';

export default function SearchPage() {
	const router = useRouter();
	const { q } = router.query;
	const [results, setResults] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const query = typeof q === 'string' ? q : '';
		if (!query) return;
		const fetchResults = async () => {
			setLoading(true);
			try {
				const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
				const res = await fetch(
					`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
						query,
					)}`,
				);
				const data = await res.json();
				// Ensure each result has a media_type so the Modal's fetch logic can determine the correct endpoint
				const normalized = (data.results || []).map((item: any) => ({
					...item,
					media_type: item.media_type || (item.first_air_date || item.name ? 'tv' : 'movie'),
				}));
				setResults(normalized);
			} catch (err) {
				console.error('Search error', err);
				setResults([]);
			} finally {
				setLoading(false);
			}
		};
		fetchResults();
	}, [q]);

	return (
		<div>
			<Head>
				<title>Search - {q}</title>
			</Head>
			<Header />
			<main className='px-4 pt-24'>
				<h1 className='mb-4 text-2xl font-semibold'>Search results for "{q}"</h1>
				{loading && <p>Loading...</p>}
				{!loading && results.length === 0 && <p>No results found.</p>}
				<div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
					{results.map((r) => (
						<div key={r.id} className='mb-4'>
							<Thumbnail movie={r} orientation='poster' tallOnLarge />
						</div>
					))}
				</div>
				{/* Mount the Modal so it can react to Recoil state set by Thumbnail clicks */}
				<Modal />
			</main>
		</div>
	);
}
