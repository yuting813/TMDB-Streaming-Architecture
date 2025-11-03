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

function Login() {
	const router = useRouter();
	const { signIn, loading } = useAuth();
	const [message, setMessage] = useState({ type: '', content: '' });
	const [isSubmitting, setIsSubmitting] = useState(false);

	// form is handled by shared AuthForm component

	// 統一的錯誤處理函數
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

	// adapter to pass to AuthForm (react-hook-form types -> simple function)
	const handleAuthFormSubmit = async (data: Inputs) => {
		await onSubmit(data);
	};

	const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		setMessage({ type: '', content: '' });

		try {
			const result = await signIn(email, password);
			if (result.success) {
				router.push('/');
				setMessage({ type: 'success', content: '登入成功！即將跳轉...' });
			} else {
				setMessage(handleAuthError({ code: result.error || '', message: '' }));
			}
		} catch (error) {
			const firebaseError = error as FirebaseAuthError;
			setMessage(handleAuthError(firebaseError));
		} finally {
			setIsSubmitting(false); // 確保在操作完成後重置狀態
		}
	};

	return (
		<div className='relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent'>
			<Head>
				<title>Netflixx</title>
				<link rel='icon' href='/logo.svg' />
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

			<AuthForm mode='login' onSubmit={handleAuthFormSubmit} loading={loading} message={message} />

			<div className='mt-6 text-[gray] text-center'>
				尚未加入Netflixx? {'  '}
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
	);
}

export default Login;
