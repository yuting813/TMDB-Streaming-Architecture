import { DocumentData } from 'firebase/firestore';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { useState } from 'react';
import { modalState, movieState } from '@/atoms/modalAtom';
import { Movie } from '@/typings';

interface Props {
	movie: Movie | DocumentData;
	orientation?: 'backdrop' | 'poster';
	// when true, make poster thumbnails taller on large screens (used by search page)
	tallOnLarge?: boolean;
}

function Thumbnail({ movie, orientation = 'backdrop', tallOnLarge = false }: Props) {
	// These state variables are used by parent/sibling components through Recoil
	// we only need the setters here; discard the first element to avoid unused var lint
	const [, setShowModal] = useRecoilState(modalState);
	const [, setCurrentMovie] = useRecoilState(movieState);
	const [imageError, setImageError] = useState(false);
	// choose poster for portrait, otherwise backdrop
	const imagePath =
		orientation === 'poster'
			? movie.poster_path || movie.backdrop_path
			: movie.backdrop_path || movie.poster_path;
	const containerClass =
		orientation === 'poster'
			? `relative h-64 min-w-[150px] cursor-pointer transition-transform duration-200 ease-out md:h-80 md:min-w-[220px] ${
					tallOnLarge ? 'md:h-[28rem] md:min-w-[220px]' : ''
				} md:hover:scale-105 rounded-xl overflow-hidden`
			: 'relative h-28 min-w-[180px] cursor-pointer transition-transform duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105 rounded-lg overflow-hidden';
	return (
		<div
			className={containerClass}
			onClick={() => {
				console.log('Thumbnail clicked', { id: movie.id, media_type: (movie as any).media_type });
				setCurrentMovie(movie);
				setShowModal(true);
			}}
		>
			<Image
				src={
					imageError || !imagePath
						? '/fallback-image.webp'
						: `https://image.tmdb.org/t/p/w500${imagePath}`
				}
				alt={movie.title || movie.name || 'Movie poster'}
				className='rounded-sm object-cover md:rounded'
				fill={true}
				sizes={
					orientation === 'poster'
						? '(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 12vw'
						: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
				}
				onError={() => {
					console.error(`Failed to load image for movie: ${movie.title || movie.name}`, imagePath);
					setImageError(true);
				}}
			/>
		</div>
	);
}

export default Thumbnail;
