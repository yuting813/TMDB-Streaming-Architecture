import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Loader from '@/components/Loader';
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

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

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

			<form
				onSubmit={handleSubmit(onSubmit)}
				onClick={(e) => e.stopPropagation()}
				className='relative mt-24 space-y-8 py-10 px-6 rounded bg-black/75 md:mt-0 md:max-w-md md:px-14'
			>
				<h1 className='text-4xl font-semibold '>註冊</h1>
				<div className='space-y-4'>
					<label className='inline-block w-full'>
						<input
							type='email'
							placeholder='Email'
							className='input'
							{...register('email', {
								required: '請輸入有效的電子郵件地址。',
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: '請輸入有效的電子郵件地址。',
								},
							})}
						/>

						{errors.email && (
							<p className='p-1 text-[13px] font-light text-orange-500'>{errors.email.message}</p>
						)}
					</label>
					<label className='inline-block w-full'>
						<input
							type='password'
							placeholder='Password'
							className='input'
							{...register('password', {
								required: '您的密碼必須包含 4 至 60 個字元。',
								minLength: { value: 6, message: '您的密碼必須包含 4 至 60 個字元。' },
								maxLength: { value: 60, message: '您的密碼必須包含 4 至 60 個字元。' },
							})}
						/>
						{errors.password && (
							<p className='p-1 text-[13px] font-light text-orange-500  '>
								{errors.password.message}
							</p>
						)}
					</label>
				</div>
				{message.content && (
					<div
						className={`p-3 rounded text-center ${
							message.type === 'success'
								? 'bg-green-500/20 text-green-500'
								: 'bg-red-500/20 text-red-500'
						}`}
					>
						{message.content}
					</div>
				)}

				<button
					disabled={loading}
					className={`w-full rounded py-3 font-semibold ${
						loading || message.type === 'success'
							? 'bg-[#e50914]/60'
							: 'bg-[#e50914] hover:bg-[#e50914]/80'
					}`}
				>
					{loading ? (
						<Loader color='fill-white' />
					) : (
						<div className='flex items-center justify-center space-x-2'>註冊</div>
					)}
				</button>

				<div className='text-[gray] text-center'>
					已經有帳號? {'  '}
					<button
						type='button'
						onClick={() => router.push('/login')}
						className='text-white hover:underline '
					>
						立即登入。
					</button>
				</div>
			</form>
		</div>
	);
}

export default Signup;
