import MuiModal from '@mui/material/Modal';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
	open: boolean;
	onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
	const [query, setQuery] = useState('');
	const inputRef = useRef<HTMLInputElement | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (open) {
			setTimeout(() => inputRef.current?.focus(), 50);
		} else {
			setQuery('');
		}
	}, [open]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const q = query.trim();
		if (!q) {
			toast('Please enter a search term', { duration: 2000 });
			return;
		}
		// Navigate to dedicated search results page
		router.push(`/search?q=${encodeURIComponent(q)}`);
		toast(`Searching for "${q}"`, { duration: 1500 });
		onClose();
	};

	return (
		<MuiModal
			open={open}
			onClose={onClose}
			className='fixed left-0 right-0 top-0 z-50 mx-auto flex items-start justify-center p-4'
		>
			<div className='w-full max-w-2xl rounded bg-[#141414] p-6 shadow-lg'>
				<form onSubmit={handleSubmit} className='flex items-center gap-3'>
					<label htmlFor='site-search' className='sr-only'>
						Search movies and shows
					</label>
					<input
						id='site-search'
						ref={inputRef}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Search for a movie, show, actor...'
						className='w-full rounded bg-[#222] px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#e50914]'
					/>
					<button
						type='submit'
						className='rounded bg-[#e50914] px-4 py-2 text-sm font-medium text-white hover:opacity-90'
					>
						Search
					</button>
					<button
						type='button'
						onClick={onClose}
						className='ml-2 rounded bg-white/5 px-3 py-2 text-sm text-white hover:opacity-90'
					>
						Close
					</button>
				</form>
			</div>
		</MuiModal>
	);
}
