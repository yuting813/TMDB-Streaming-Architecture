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

function Login() {
	const router = useRouter();
	const { signIn, loading, initialLoading } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// form is handled by shared AuthForm component

	// adapter to pass to AuthForm (react-hook-form types -> simple function)
	const handleAuthFormSubmit = async (data: Inputs) => {
		await onSubmit(data);
	};

	const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
		if (isSubmitting) return;
		setIsSubmitting(true);

		try {
			const result = await signIn(email, password);
			if (result.success) {
				router.push('/');
			}
		} finally {
			setIsSubmitting(false); // 確保在操作完成後重置狀態
		}
	};

	return (
		<div className='relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent'>
			<Head>
				<title>Stream Demo - Portfolio Project by Tina Hu</title>
			</Head>

			{/* Portfolio Disclaimer Banner */}
			<div className='fixed left-0 right-0 top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10 px-4 py-3 text-center text-xs md:text-sm font-light tracking-wide text-gray-300 shadow-lg'>
				<span className='hidden sm:inline'>This is a </span>
				<span className='font-bold text-white'>Portfolio Demo</span>
				{' — '}
				<span className='block sm:inline'>NOT affiliated with Netflix<span className='hidden sm:inline'> or any streaming service</span></span>
			</div>
			
			<Image
				src='/stream-login-bg.webp'
				alt='Login page background image'
				className='absolute inset-0 -z-10 hidden h-screen w-screen object-cover brightness-[35%] blur-[2px] sm:inline'
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

			<div className='flex w-full flex-grow flex-col items-center justify-center px-4 mt-28 md:mt-0'>
				<AuthForm
					mode='login'
					onSubmit={handleAuthFormSubmit}
					loading={loading || isSubmitting || initialLoading}
				/>

				<div className='mt-6 text-center text-[gray]'>
					尚未加入Stream? {'  '}
					<button
						type='button'
						onClick={async (e) => {
							e.preventDefault();
							e.stopPropagation();
							console.log('Navigating to signup...');
							try {
								await router.replace('/signup');
							} catch (err) {
								console.error('Navigation error:', err);
							}
						}}
						className='inline-block text-white hover:underline'
					>
						馬上註冊。
					</button>
				</div>
			</div>

			<div className='bottom-0 w-full'>
				<Footer />
			</div>
		</div>
	);
}

export default Login;
