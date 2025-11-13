/* eslint-disable @next/next/no-img-element */
import { BellIcon, SearchIcon } from '@heroicons/react/solid';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import useSubscription from '@/hooks/useSubscription';
import BasicMenu from './BasicMenu';

// Dynamically import SearchModal to avoid heavy client bundle (MUI) on initial load
const SearchModal = dynamic(() => import('./SearchModal'), { ssr: false });

function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [hasNotifications, setHasNotifications] = useState(true);
	const [showAccountMenu, setShowAccountMenu] = useState(false);
	const { logout, user } = useAuth();
	const { subscription } = useSubscription(user ?? null);
	const [showSearchModal, setShowSearchModal] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<header className={`${isScrolled ? 'bg-[#141414]' : 'bg-black/10'}`}>
			<div className='flex items-center space-x-2 md:space-x-6'>
				<Link href='/' aria-label='Go to homepage'>
					<Image
						src='/logo.svg'
						width={40}
						height={40}
						className='cursor-pointer object-contain'
						alt='Stream logo'
					/>
				</Link>

				<BasicMenu />

				<ul className='hidden space-x-4 md:flex'>
					<li>
						<a className='headerLink' href='/'>
							Home
						</a>
					</li>
					<li>
						<a className='headerLink' href='/tv'>
							TV Shows
						</a>
					</li>
					<li>
						<a className='headerLink' href='/movies'>
							Movies
						</a>
					</li>
					<li>
						<a className='headerLink' href='/new'>
							New & Popular
						</a>
					</li>
					<li>
						<a className='headerLink' href='/mylist'>
							My List
						</a>
					</li>
				</ul>
			</div>
			<div className='flex items-center space-x-4 text-sm font-light'>
				<button
					aria-label='Search for movies and shows'
					className='iconButton'
					onClick={() => setShowSearchModal(true)}
					title='Search'
				>
					<SearchIcon className='h-7 w-7' />
				</button>
				<SearchModal open={showSearchModal} onClose={() => setShowSearchModal(false)} />

				<button aria-label='Kids' className='iconButton hidden lg:inline-flex' title='Kids section'>
					<span className='text-base'>Kids</span>
				</button>

				<button
					aria-label='Notifications'
					className='iconButton relative'
					onClick={() => {
						console.log('Notifications clicked');
					}}
					title='View notifications'
				>
					<BellIcon className='h-6 w-6' />
					{hasNotifications && (
						<span
							className='absolute -right-0 -top-0 inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-600'
							aria-hidden='true'
						/>
					)}
				</button>

				<div className='relative pl-2'>
					<button
						aria-label='Account and settings'
						className='iconButton overflow-hidden rounded-full p-0'
						onClick={() => setShowAccountMenu((s) => !s)}
						title='Account'
					>
						<img src='https://rb.gy/g1pwyx' alt='User account' className='h-8 w-9 object-cover' />
					</button>

					{showAccountMenu && (
						<div className='absolute right-0 mt-2 w-56 rounded bg-[#141414] p-3 shadow-lg'>
							<div className='mb-2 px-1 text-sm'>
								<p className='truncate font-semibold'>{user?.email ?? 'Guest'}</p>
								<p className='text-xs text-[gray]'>
									{subscription ? 'Membership: Active' : 'No active plan'}
								</p>
							</div>
							<hr className='my-2 border-gray-700' />
							<button
								className='w-full rounded bg-[#e50914] px-3 py-2 text-sm font-medium text-white hover:opacity-90'
								onClick={async () => {
									setShowAccountMenu(false);
									await logout();
								}}
							>
								Sign out
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

export default Header;
