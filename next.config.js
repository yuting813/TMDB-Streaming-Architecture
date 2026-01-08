/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@invertase/firestore-stripe-payments']);

const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['image.tmdb.org', 'rb.gy'],
	},
};

module.exports = withTM(nextConfig);