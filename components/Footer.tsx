function Footer() {
	return (
		<footer className='w-full bg-black/60 py-6 text-center text-[10px] text-gray-500 md:text-sm'>
			<div className='mx-auto flex w-full max-w-7xl flex-col items-center justify-center space-y-2 px-4'>
				<p className='font-semibold text-gray-400'>
					DISCLAIMER: This is a Portfolio Project for Educational Purposes Only
				</p>
					<p>
					This website is an educational portfolio project created to demonstrate full-stack
					development skills. It is NOT a commercial service and is NOT affiliated with, endorsed
					by, or associated with any official streaming platforms or existing media corporations.
				</p>
				<p>⚠️ Demo credentials are provided above — No real personal data is collected or stored.</p>
				<p className='mt-2'>&copy; {new Date().getFullYear()} - Built by Tina Hu</p>
			</div>
		</footer>
	);
}

export default Footer;
