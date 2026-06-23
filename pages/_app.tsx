import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { RecoilEnv, RecoilRoot } from 'recoil';
import { AuthProvider } from '../hooks/useAuth';

// Disable Recoil duplicate atom key checking to prevent crashes during Next.js Hot Module Replacement (HMR) and Server-Side Rendering (SSR)
if (process.env.NODE_ENV !== 'production') {
	RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;
}

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<RecoilRoot>
			<AuthProvider>
				<Component {...pageProps} />
			</AuthProvider>
		</RecoilRoot>
	);
}

export default MyApp;
