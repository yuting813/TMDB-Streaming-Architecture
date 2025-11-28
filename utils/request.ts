// 1. ENV configuration
//-------------------------------------------------------------
const ENV_API_KEY =
	(process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.NEXT_PUBLIC_API_KEY || '').trim() ||
	undefined;

const BASE_URL = 'https://api.themoviedb.org/3';

// Global fetch cache to avoid duplicate TMDB requests
const fetchCache = new Map<string, Promise<any>>();

export type TmdbFetchOptions = {
	params?: Record<string, string | number | boolean | undefined>;
	timeout?: number;
	signal?: AbortSignal;
};

export type TmdbResponse<T> = {
	page?: number;
	results?: T[];
	total_pages?: number;
	total_results?: number;
} & Record<string, any>;

//-------------------------------------------------------------
// 2. Pure helpers to build a clean TMDB URL
//-------------------------------------------------------------
function resolveBaseUrl(pathOrUrl: string): URL {
	const isFull = /^https?:\/\//i.test(pathOrUrl);
	const base = isFull
		? pathOrUrl
		: `${BASE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
	return new URL(base);
}

function mergeParams(url: URL, params?: Record<string, string | number | boolean | undefined>) {
	if (!params) return;

	Object.entries(params).forEach(([k, v]) => {
		if (v === undefined || v === null) return;
		url.searchParams.set(k, String(v));
	});
}

function ensureApiKey(url: URL, params?: Record<string, any>) {
	const hasKeyInParams = params && Object.prototype.hasOwnProperty.call(params, 'api_key');
	const hasKeyInUrl = url.searchParams.has('api_key');

	if (!ENV_API_KEY && !hasKeyInParams && !hasKeyInUrl) {
		throw new Error('TMDB API key missing. Set NEXT_PUBLIC_TMDB_API_KEY in your environment.');
	}

	if (!hasKeyInUrl && !hasKeyInParams && ENV_API_KEY) {
		url.searchParams.set('api_key', ENV_API_KEY);
	}
}

function finalizeUrl(url: URL): string {
	return url.toString();
}

//-------------------------------------------------------------
// 3. Unified URL builder (composed from pure helpers)
//-------------------------------------------------------------
function buildUrl(
	pathOrUrl: string,
	params?: Record<string, string | number | boolean | undefined>,
): string {
	const url = resolveBaseUrl(pathOrUrl);

	ensureApiKey(url, params);
	mergeParams(url, params);

	return finalizeUrl(url);
}

//-------------------------------------------------------------
// 4. Main TMDB Fetch wrapper with cache + timeout + typing
//-------------------------------------------------------------
export async function tmdbFetch<T = any>(path: string, options: TmdbFetchOptions = {}): Promise<T> {
	const { params, timeout = 8000, signal: userSignal } = options;

	const url = buildUrl(path, params);

	// Check fetch cache—return existing promise if present
	if (fetchCache.has(url)) {
		return fetchCache.get(url)!;
	}

	// Create the actual fetch promise
	const fetchPromise = (async () => {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		// Combine user-provided signal with timeout signal
		const finalSignal = userSignal
			? mergeAbortSignals(userSignal, controller.signal)
			: controller.signal;

		try {
			const res = await fetch(url, { signal: finalSignal });
			clearTimeout(timeoutId);

			if (!res.ok) {
				const text = await res.text().catch(() => '');
				const msg = `TMDB fetch error ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`;
				const err: any = new Error(msg);
				err.status = res.status;
				throw err;
			}

			return (await res.json()) as T;
		} catch (err: any) {
			if (err.name === 'AbortError') {
				const e: any = new Error('Request aborted (timeout or signal)');
				e.code = 'ABORTED';
				throw e;
			}
			throw err;
		} finally {
			clearTimeout(timeoutId);
		}
	})();

	// Save promise in cache
	fetchCache.set(url, fetchPromise);

	// If the promise rejects, remove it from cache to avoid stuck cache
	fetchPromise.catch(() => fetchCache.delete(url));

	return fetchPromise;
}

//-------------------------------------------------------------
// Helper: merge two AbortSignals (timeout + user signal)
//-------------------------------------------------------------
function mergeAbortSignals(signalA: AbortSignal, signalB: AbortSignal): AbortSignal {
	const controller = new AbortController();
	const onAbort = () => controller.abort();

	signalA.addEventListener('abort', onAbort);
	signalB.addEventListener('abort', onAbort);

	// Clean up when merged signal aborts
	controller.signal.addEventListener(
		'abort',
		() => {
			signalA.removeEventListener('abort', onAbort);
			signalB.removeEventListener('abort', onAbort);
		},
		{ once: true },
	);

	return controller.signal;
}

//-------------------------------------------------------------
// 5. Backwards-compatible constants (do not break imports)
//-------------------------------------------------------------
const requests = {
	fetchTrending: `${BASE_URL}/trending/all/week`,
	fetchNetflixOriginals: `${BASE_URL}/discover/movie?with_networks=213`,
	fetchTopRated: `${BASE_URL}/movie/top_rated`,
	fetchActionMovies: `${BASE_URL}/discover/movie?with_genres=28`,
	fetchComedyMovies: `${BASE_URL}/discover/movie?with_genres=35`,
	fetchHorrorMovies: `${BASE_URL}/discover/movie?with_genres=27`,
	fetchRomanceMovies: `${BASE_URL}/discover/movie?with_genres=10749`,
	fetchDocumentaries: `${BASE_URL}/discover/movie?with_genres=99`,
};

export default requests;
