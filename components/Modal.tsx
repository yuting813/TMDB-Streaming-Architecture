import { CheckIcon, PlusIcon, ThumbUpIcon, VolumeOffIcon, XIcon } from '@heroicons/react/outline';
import { VolumeUpIcon } from '@heroicons/react/solid';
import MuiModal from '@mui/material/Modal';
import { collection, deleteDoc, doc, DocumentData, onSnapshot, setDoc } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaPause, FaPlay } from 'react-icons/fa';
import ReactPlayer from 'react-player/lazy';
import { modalState, movieState } from '../atoms/modalAtom';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import { tmdbFetch } from '../utils/request';
import { Element, Genre, Movie } from '../typings';

function Modal() {
	const [showModal, setShowModal] = useRecoilState(modalState);
	const [movie] = useRecoilState(movieState);
	const triggerElementRef = useRef<HTMLElement | null>(null);
	const modalRef = useRef<HTMLDivElement | null>(null);
	const [trailer, setTrailer] = useState('');
	const [genres, setGenres] = useState<Genre[]>([]);
	const [muted, setMuted] = useState(true);
	const [addedToList, setAddedToList] = useState(false);
	// Local UX states for quick feedback
	const [isPlayingBtn, setIsPlayingBtn] = useState(false);
	const [playing, setPlaying] = useState(true);
	const [liked, setLiked] = useState(false);
	const { user } = useAuth();
	const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);

	const toastStyle = {
		background: 'white',
		color: 'black',
		fontWeight: 'bold',
		fontSize: '16px',
		padding: '15px',
		borderRadius: '9999px',
		maxWidth: '1000px',
	};

	useEffect(() => {
		if (!movie) return;

		if (process.env.NODE_ENV !== 'production') {
			console.log('Modal: movie changed, fetching details for', {
				id: movie.id,
				media_type: movie.media_type,
			});
		}

		async function fetchMovie() {
			const data = await tmdbFetch<any>(
				`/${movie?.media_type === 'tv' ? 'tv' : 'movie'}/${movie?.id}`,
				{
					params: {
						language: 'en-US',
						append_to_response: 'videos',
					},
				},
			).catch((err) => console.log(err.message));

			if (data?.videos) {
				const index = data.videos.results.findIndex(
					(element: Element) => element.type === 'Trailer',
				);
				setTrailer(data.videos?.results[index]?.key);
			}
			if (data?.genres) {
				setGenres(data.genres);
			}
		}

		fetchMovie();
	}, [movie]);

	useEffect(() => {
		if (user) {
			const unsubscribe = onSnapshot(
				collection(db, 'customers', user.uid, 'myList'),
				(snapshot) => {
					try {
						setMovies(snapshot.docs.map((doc) => doc.data()));
					} catch (error) {
						console.error('Error fetching My List:', error);
						//Handle the error appropriately, perhaps by showing an error message.
					}
				},
				(error) => {
					console.error('Error listening to My List:', error);
					//Handle the error appropriately.
				},
			);
			return unsubscribe; // Important to unsubscribe when the component unmounts.
		}
	}, [user]);

	// Check if the movie is already in the user's list
	useEffect(
		() => setAddedToList(movies.findIndex((result) => result.id === movie?.id) !== -1),
		[movies, movie],
	);

	const handleList = async () => {
		if (!user) {
			toast('Please sign in to add movies to your list', {
				duration: 8000,
				style: toastStyle,
			});
			return;
		}

		if (!movie) {
			toast('Unable to add movie, please try again later', {
				duration: 8000,
				style: toastStyle,
			});
			return;
		}

		if (addedToList) {
			await deleteDoc(doc(db, 'customers', user.uid, 'myList', movie.id.toString()));

			toast(`${movie?.title || movie?.original_name} has been removed from My List`, {
				duration: 8000,
				style: toastStyle,
			});
		} else {
			await setDoc(doc(db, 'customers', user.uid, 'myList', movie.id.toString()), { ...movie });

			toast(`${movie?.title || movie?.original_name} has been added to My List`, {
				duration: 8000,
				style: toastStyle,
			});
		}
	};

	const handleClose = () => {
		setShowModal(false);
		// Return focus to the trigger element (e.g., Thumbnail that opened the modal)
		setTimeout(() => {
			triggerElementRef.current?.focus();
		}, 0);
	};

	// Store reference to the element that triggered the modal open
	useEffect(() => {
		if (showModal) {
			triggerElementRef.current = document.activeElement as HTMLElement;
		}
	}, [showModal]);

	// Focus trap: keep focus inside modal while open
	useEffect(() => {
		const handleTabKey = (e: KeyboardEvent) => {
			if (e.key !== 'Tab' || !modalRef.current) return;

			const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);

			if (focusableElements.length === 0) return;

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];
			const activeElement = document.activeElement;

			if (e.shiftKey) {
				if (activeElement === firstElement) {
					e.preventDefault();
					lastElement.focus();
				}
			} else {
				if (activeElement === lastElement) {
					e.preventDefault();
					firstElement.focus();
				}
			}
		};

		if (showModal) {
			window.addEventListener('keydown', handleTabKey);
			// Move focus to first focusable element
			modalRef.current?.querySelector<HTMLElement>('button')?.focus();
		}

		return () => window.removeEventListener('keydown', handleTabKey);
	}, [showModal]);

	// Close modal on Escape key press for accessibility
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setShowModal(false);
			}
		};

		if (showModal) window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [showModal]);

	// Quick UX handlers for Play and ThumbUp buttons
	const handlePlayClick = () => {
		if (!movie || !trailer) {
			toast('Trailer not available', { duration: 3000, style: toastStyle });
			return;
		}

		// Toggle play/pause
		setPlaying((prev) => {
			const next = !prev;
			if (next) {
				// Brief feedback when starting
				setIsPlayingBtn(true);
				setTimeout(() => setIsPlayingBtn(false), 1200);
			}
			return next;
		});
	};

	const handleThumbUpClick = () => {
		setLiked((prev) => {
			const next = !prev;
			toast(next ? 'Added to your likes' : 'Removed like', {
				duration: 3000,
				style: toastStyle,
			});
			return next;
		});
	};

	return (
		<MuiModal
			open={showModal}
			onClose={handleClose}
			className='fixex !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide'
		>
			<div ref={modalRef}>
				<Toaster position='bottom-center' />
				<button
					onClick={handleClose}
					className='modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]'
				>
					<XIcon className='h-6 w-6' />
				</button>

				<div className='relative pt-[56.25%]'>
					<ReactPlayer
						url={`https://www.youtube.com/watch?v=${trailer}`}
						width='100%'
						height='100%'
						style={{ position: 'absolute', top: '0', left: '0' }}
						playing={playing}
						muted={muted}
						onPlay={() => {
							setPlaying(true);
							setIsPlayingBtn(true);
							setTimeout(() => setIsPlayingBtn(false), 1200);
						}}
						onPause={() => setPlaying(false)}
						onEnded={() => setPlaying(false)}
					/>
					<div className='absolute bottom-2 flex w-full items-center justify-between px-4 sm:bottom-10 sm:px-10'>
						{/* Desktop controls: large play button + small buttons */}
						<div className='hidden items-center space-x-2 sm:flex'>
							<button
								onClick={handlePlayClick}
								aria-pressed={playing}
								aria-label='Play trailer'
								className={
									'flex items-center gap-x-2 rounded px-8 py-2 text-xl font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
									(isPlayingBtn
										? 'scale-95 transform bg-green-500 text-white hover:bg-green-600'
										: playing
											? 'bg-green-600 text-white hover:bg-green-700'
											: 'bg-white text-black hover:bg-[#e6e6e6]')
								}
							>
								{isPlayingBtn ? (
									<>
										<svg
											className='h-6 w-6 animate-spin text-white'
											viewBox='0 0 24 24'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<circle
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
										<span>Playing</span>
									</>
								) : playing ? (
									<>
										<FaPause className='h-7 w-7 text-white' />
										<span>Pause</span>
									</>
								) : (
									<>
										<FaPlay className='h-7 w-7 text-black' />
										<span>Play</span>
									</>
								)}
							</button>

							<button className='modalButton' onClick={handleList} aria-label='Add to My List'>
								{addedToList ? <CheckIcon className='h-7 w-7' /> : <PlusIcon className='h-7 w-7' />}
							</button>

							<button
								onClick={handleThumbUpClick}
								aria-pressed={liked}
								aria-label='Like'
								className={
									'modalButton transition-transform ' + (liked ? 'scale-110 text-blue-400' : '')
								}
							>
								<ThumbUpIcon className='h-7 w-7' />
							</button>
						</div>

						{/* Mobile controls: Play (rectangular, smaller), Add, Like, Muted — evenly spaced */}
						<div className='flex w-full items-center justify-around px-6 sm:hidden'>
							<button
								onClick={handlePlayClick}
								aria-pressed={playing}
								aria-label='Play trailer'
								className={
									'flex items-center gap-x-2 rounded px-10 py-2 text-lg font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
									(isPlayingBtn
										? 'scale-95 transform bg-green-500 text-white'
										: playing
											? 'bg-green-600 text-white'
											: 'bg-white text-black')
								}
							>
								{playing ? <FaPause className='h-6 w-6' /> : <FaPlay className='h-5 w-5' />}
								<span className='hidden sm:inline-block'>{playing ? 'Pause' : 'Play'}</span>
							</button>

							<button
								className='modalButton h-11 w-11'
								onClick={handleList}
								aria-label='Add to My List'
							>
								{addedToList ? <CheckIcon className='h-6 w-6' /> : <PlusIcon className='h-6 w-6' />}
							</button>

							<button
								className={`modalButton h-11 w-11 ${liked ? 'scale-110 text-blue-400' : ''}`}
								onClick={handleThumbUpClick}
								aria-label='Like'
							>
								<ThumbUpIcon className='h-6 w-6' />
							</button>

							{/* <button className='modalButton h-12 w-12 SM:hidden' onClick={() => setMuted(!muted)} aria-label='Toggle mute'>
								{muted ? <VolumeOffIcon className='h-6 w-6' /> : <VolumeUpIcon className='h-6 w-6' />}
							</button> */}
						</div>

						{/* Mute button kept on the right (desktop + mobile) */}
						<button className='modalButton' onClick={() => setMuted(!muted)}>
							{muted ? <VolumeOffIcon className='h-6 w-6' /> : <VolumeUpIcon className='h-6 w-6' />}
						</button>
					</div>
				</div>

				<div className='flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8'>
					<div className='space-y-6 text-lg'>
						<div className='flex items-center space-x-2 text-sm'>
							<p className='font-semibold text-green-400'>
								{movie?.vote_average ? `${(movie.vote_average * 10).toFixed(0)}%` : ''}Match
							</p>
							<p className='font-light'>{movie?.release_date || movie?.first_air_date}</p>
							<div className='flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs'>
								HD
							</div>
						</div>

						<div className='flex flex-col gap-x-10 gap-y-4 font-light md:flex-row'>
							<p className='w-5/6'>{movie?.overview}</p>
							<div className='flex flex-col space-y-3 text-sm'>
								<div>
									<span className='text-[gray]'>Genres: </span>
									{genres.map((genre) => genre.name).join(', ')}
								</div>

								<div>
									<span className='text-[gray]'>Original language: </span>
									{movie?.original_language}
								</div>

								<div>
									<span className='text-[gray]'>Total votes: </span>
									{movie?.vote_count}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MuiModal>
	);
}

export default Modal;
