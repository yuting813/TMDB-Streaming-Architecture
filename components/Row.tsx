import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { DocumentData } from 'firebase/firestore';
import React, { useRef, useState } from 'react';
import { Movie } from '@/typings';
import Thumbnail from './Thumbnail';

interface Props {
	title: string;
	movies: Movie[] | DocumentData[];
	/** 'backdrop' (default) shows wide images; 'poster' shows vertical posters */
	orientation?: 'backdrop' | 'poster';
}

function Row({ title, movies, orientation = 'backdrop' }: Props) {
	const rowRef = useRef<HTMLDivElement>(null);
	const [isMoved, setIsMoved] = useState(false);

	const handleClick = (direction: string) => {
		setIsMoved(true);
		if (rowRef.current) {
			const { scrollLeft, clientWidth } = rowRef.current;
			const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
			rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
		}
	};

	// if poster orientation, allow auto height so posters can be taller
	let containerClass = 'h-40 space-y-0.5 md:space-y-1';
	if (orientation === 'poster') {
		containerClass = 'h-auto space-y-0.5 md:space-y-1';
	}

	return (
		<div className={containerClass}>
			<h2 className='w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-xl '>
				{title}
			</h2>
			<div className='group relative md:-ml-2'>
				<ChevronLeftIcon
					className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${
						!isMoved && 'hidden'
					}`}
					onClick={() => handleClick('left')}
				/>
				<div
					ref={rowRef}
					className={
						orientation === 'poster'
							? 'flex scrollbar-hide items-center space-x-3 overflow-x-scroll md:space-x-5 md:p-3'
							: 'flex scrollbar-hide items-center space-x-1 overflow-x-scroll md:space-x-3 md:p-2'
					}
					aria-label={`${title} row`}
				>
					{movies.map((movie) => (
						<Thumbnail key={movie.id} movie={movie} orientation={orientation} />
					))}
				</div>
				<ChevronRightIcon
					className='absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100'
					onClick={() => handleClick('right')}
				/>
			</div>
		</div>
	);
}

export default Row;
