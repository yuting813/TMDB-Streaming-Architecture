import { XIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function BasicMenu() {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (!open) {
			triggerRef.current?.focus();
		} else {
			// move focus into panel
			panelRef.current?.querySelector<HTMLElement>('a,button')?.focus();
		}
	}, [open]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false);
		};
		if (open) window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open]);

	const navLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Movies', href: '/movies' },
		{ label: 'New & Popular', href: '/new' },
		{ label: 'My List', href: '/mylist' },
	];

	return (
		<div className='md:hidden'>
			<button
				ref={triggerRef}
				aria-expanded={open}
				aria-controls='mobile-menu'
				className='flex items-center gap-2 rounded px-3 py-2 text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#e50914]'
				onClick={() => setOpen(true)}
			>
				Browse
				<span className='ml-[5px] inline-block h-0 w-0 border-[6px] border-b-0 border-x-transparent border-t-white' />
			</button>

			{open && (
				<div
					id='mobile-menu'
					role='dialog'
					aria-modal='true'
					ref={panelRef}
					className='fixed inset-0 z-50 flex flex-col bg-black/95 p-5 backdrop-blur-sm'
				>
					<div className='flex items-center justify-between'>
						<h3 className='text-lg font-semibold text-white'>Menu</h3>
						<button
							aria-label='Close menu'
							className='rounded p-2 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#e50914]'
							onClick={() => setOpen(false)}
						>
							<XIcon className='h-6 w-6 text-white' />
						</button>
					</div>

					<nav className='mt-6 flex-1'>
						<ul className='space-y-4'>
							{navLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className={`block py-2 text-lg font-medium transition-colors ${
											router.pathname === link.href
												? 'font-bold text-[#e50914]'
												: 'text-white hover:text-gray-300'
										}`}
										onClick={() => setOpen(false)}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className='mt-6 flex justify-end'>
						<button
							className='rounded bg-[#e50914] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700'
							onClick={() => setOpen(false)}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
