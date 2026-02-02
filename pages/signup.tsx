import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import AuthForm from '@/components/AuthForm';
import Footer from '@/components/Footer';
import useAuth from '@/hooks/useAuth';

type Inputs = {
	email: string;
	password: string;
};

function Signup() {
	const router = useRouter();
	const { signUp, loading, initialLoading } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
		if (isSubmitting) return;
		setIsSubmitting(true);

		try {
			const result = await signUp(email, password);
			if (result.success) {
				router.push('/');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleAuthFormSubmit = async (data: Inputs) => {
		await onSubmit(data);
	};

	return (
		<div className='relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent'>
			<Head>
				<title>Stream Demo - Portfolio Project by Tina Hu</title>
			</Head>

			{/* Portfolio Disclaimer Banner */}
			<div className='fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/80 px-4 py-3 text-center text-xs font-light tracking-wide text-gray-300 shadow-lg backdrop-blur-sm md:text-sm'>
				<span className='hidden sm:inline'>This is a </span>
				<span className='font-bold text-white'>Portfolio Demo</span>
				{' — '}
				<span className='block sm:inline'>
					NOT affiliated with Netflix
					<span className='hidden sm:inline'> or any streaming service</span>
				</span>
			</div>
			<Image
				src='/stream-login-bg.webp'
				alt='Signup page background image'
				className='absolute inset-0 -z-10 hidden h-screen w-screen object-cover blur-[8px] brightness-[35%] sm:inline'
				fill
				sizes='100vw'
				priority
				quality={75}
			/>

			<Image
				src='/logo.svg'
				width={75}
				height={75}
				className='absolute left-4 top-14 cursor-pointer object-contain md:left-10 md:top-16'
				alt='logo'
				priority
				sizes='75px'
			/>
			<div className='mt-28 flex w-full flex-grow flex-col items-center justify-center px-4 md:mt-0'>
				<AuthForm
					mode='signup'
					onSubmit={handleAuthFormSubmit}
					loading={loading || isSubmitting || initialLoading}
				/>

				<div className='mt-6 text-center text-[gray]'>
					已經有帳號? {'  '}
					<button
						type='button'
						onClick={() => router.push('/login')}
						className='text-white hover:underline'
					>
						立即登入。
					</button>
				</div>
			</div>
			<div className='bottom-0 w-full'>
				<Footer />
			</div>
		</div>
	);
}

export default Signup;
