import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<meta
					name='description'
					content='Stream - Production-Ready Reference Implementation by Tina Hu. Technical showcase demonstrating Next.js, Firebase, and Stripe integration. NOT a commercial service.'
				/>
				<link rel='icon' href='/logo.svg' type='image/svg+xml' />
				<link rel='apple-touch-icon' href='/logo.png' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
