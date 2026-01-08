function Footer() {
    return (
        <footer className="w-full bg-black/60 py-6 text-center text-[10px] text-gray-500 md:text-sm">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center space-y-2 px-4">
                <p className="font-semibold text-gray-400">
                    DISCLAIMER: This is a Portfolio Project for Educational Purposes Only
                </p>
                <p>
                    This website is a clone created to demonstrate development skills. It is NOT
                    affiliated with, endorsed by, or associated with Netflix, Inc.
                </p>
                <p>
                    Please DO NOT enter real credentials. No payment is required or processed.
                </p>
                <p className="mt-2">
                    &copy; {new Date().getFullYear()} - Built by Tina Hu
                </p>
            </div>
        </footer>
    );
}

export default Footer;
