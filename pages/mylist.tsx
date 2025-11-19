import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import Row from '@/components/Row';
import useAuth from '@/hooks/useAuth';
import useList from '@/hooks/useList';

export default function MyListPage() {
	const router = useRouter();
	const { user, loading } = useAuth();
	const list = useList(user?.uid);

	if (loading) return null;
	if (!user) {
		router.push('/login');
		return null;
	}

	return (
		<div>
			<Head>
				<title>My List</title>
			</Head>
			<Header />
			<main className='m-10 px-4 pt-24'>
				<p className='mb-1 ml-1 text-xl font-bold'>My List</p>
				{list.length === 0 ? (
					<p className='text-gray-400'>
						Your list is empty. Add movies to your list to see them here.
					</p>
				) : (
					<section className='space-y-8'>
						<Row title='' movies={list} orientation='poster' />
					</section>
				)}
			</main>
			<Modal />
		</div>
	);
}
