import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<meta
					name="description"
					content="This is a Netflix Clone Portfolio Project for educational purposes only. NOT the real Netflix."
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
