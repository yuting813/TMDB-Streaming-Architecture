import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 768) {
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const checkWidth = () => setIsMobile(window.innerWidth < breakpoint);
			checkWidth();
			window.addEventListener('resize', checkWidth);
			return () => window.removeEventListener('resize', checkWidth);
		}
	}, [breakpoint]);
	return isMobile;
}
