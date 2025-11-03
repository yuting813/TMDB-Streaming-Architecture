import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import AuthForm from '@/components/AuthForm';
import useAuth from '@/hooks/useAuth';

interface FirebaseAuthError {
	code: string;
	message: string;
}

type Inputs = {
	email: string;
	password: string;
};

function Signup() {
	const router = useRouter();
	const { signUp, loading } = useAuth();
	const [message, setMessage] = useState({ type: '', content: '' });
	const [isSubmitting, setIsSubmitting] = useState(false);

	// form handled by shared AuthForm component
	const handleAuthError = (error: FirebaseAuthError) => {
		switch (error.code) {
			case 'auth/email-already-in-use':
				return { type: 'error', content: '此信箱已被註冊，請直接登入' };
			case 'auth/user-not-found':
				return { type: 'error', content: '帳號未註冊，請先註冊帳號' };
			case 'auth/wrong-password':
				return { type: 'error', content: '密碼錯誤，請重新輸入' };
			case 'auth/invalid-email':
				return { type: 'error', content: '信箱格式不正確' };
			default:
				console.error('認證錯誤:', error);
				return { type: 'error', content: '發生錯誤，請稍後再試' };
		}
	};

	const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		setMessage({ type: '', content: '' });

		try {
			const result = await signUp(email, password);
			if (result.success) {
				setMessage({ type: 'success', content: '註冊成功！即將跳轉...' });
				setTimeout(() => router.push('/'), 1500);
			} else {
				setMessage(handleAuthError({ code: result.error || '', message: '' }));
			}
		} catch (error) {
			const firebaseError = error as FirebaseAuthError;
			setMessage(handleAuthError(firebaseError));
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
				<title>註冊 - Netflixx</title>
				<link rel='icon' href='/logo.svg' />
			</Head>
			<Image
				src='/loginImg.webp'
				alt='Signup page background image'
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

			<AuthForm mode='signup' onSubmit={handleAuthFormSubmit} loading={loading} message={message} />

			<div className='text-[gray] text-center'>
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
	);
}

export default Signup;
