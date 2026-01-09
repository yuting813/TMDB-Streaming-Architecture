import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<meta
					name="description"
					content="Stream - A premium Netflix Clone portfolio project showcasing modern web development with Next.js, Firebase, and Stripe. Educational purpose only."
				/>
				{/* Favicon / Icons - Global (Best placed in _document.tsx) */}
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
