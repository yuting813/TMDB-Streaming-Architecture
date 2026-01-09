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
				<title>Sign in to Stream- Stream</title>
			</Head>
			<Image
				src='/loginImg.webp'
				alt='Login page background image'
				className='-z-10 hidden brightness-[50%] sm:inline object-cover absolute inset-0 h-screen w-screen '
				fill
				sizes='100vw'
				priority
				quality={75}
			/>

			<Image
				src='/logo.svg'
				width={75}
				height={75}
				className='absolute left-4 top-4  cursor-pointer object-contain md:left-10 md:top-6 '
				alt='logo'
				priority
				sizes='75px'
			/>

			<div className='flex w-full flex-grow flex-col items-center justify-center px-4'>
				<AuthForm mode='login' onSubmit={handleAuthFormSubmit} loading={loading || isSubmitting || initialLoading} />

				<div className='mt-6 text-[gray] text-center'>
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
						className='text-white hover:underline inline-block'
					>
						馬上註冊。
					</button>
				</div>
			</div>

			<div className='w-full fixed bottom-0'>
				<Footer />
			</div>
		</div>
	);
}

export default Login;
