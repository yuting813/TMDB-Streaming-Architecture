import React, { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import useAuth from '@/hooks/useAuth';

type Mode = 'login' | 'signup';

type Inputs = {
	email: string;
	password: string;
};

interface Props {
	mode: Mode;
	onSubmit: (data: Inputs) => Promise<void> | void;
	loading?: boolean;
}

const ERROR_MAP: Record<string, string> = {
	'auth/email-already-in-use': '此信箱已被註冊，請直接登入',
	'auth/user-not-found': '帳號未註冊，請先註冊帳號',
	'auth/wrong-password': '密碼錯誤，請重新輸入',
	'auth/invalid-email': '信箱格式不正確',
};

const AuthForm: React.FC<Props> = ({ mode, onSubmit, loading }) => {
	const { error: authError } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const errorMessage = useMemo(() => {
		if (!authError) return '';
		return ERROR_MAP[authError] || '發生錯誤，請稍後再試';
	}, [authError]);

	const submit: SubmitHandler<Inputs> = async (data) => {
		await onSubmit(data);
	};

	return (
		<form
			onSubmit={handleSubmit(submit)}
			className='relative mt-24 space-y-8 py-10 px-6 rounded bg-black/75 md:mt-0 md:max-w-md md:px-14'
		>
			<h1 className='text-4xl font-semibold '>{mode === 'login' ? '登入' : '註冊'}</h1>

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
						<p className='p-1 text-[13px] font-light text-orange-500'>{errors.password.message}</p>
					)}
				</label>
			</div>

			{errorMessage && (
				<div className='rounded bg-red-500/20 p-3 text-center text-red-500'>{errorMessage}</div>
			)}

			<button
				disabled={loading}
				className={`w-full rounded py-3 font-semibold ${
					loading ? 'bg-[#e50914]/60' : 'bg-[#e50914] hover:bg-[#e50914]/80'
				}`}
			>
				{loading ? (
					<div className='flex items-center justify-center'>
						<svg className='animate-spin h-5 w-5 text-white' viewBox='0 0 24 24'>
							<circle
								className='opacity-25'
								cx='12'
								cy='12'
								r='10'
								stroke='currentColor'
								strokeWidth='4'
								fill='none'
							/>
							<path
								className='opacity-75'
								fill='currentColor'
								d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
							/>
						</svg>
					</div>
				) : (
					<div className='flex items-center justify-center space-x-2'>
						{mode === 'login' ? '登入' : '註冊'}
					</div>
				)}
			</button>
		</form>
	);
};

export default AuthForm;
