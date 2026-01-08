export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const IMAGE_SIZES = {
    original: 'original',
    w500: 'w500',
    w300: 'w300',
} as const;

// 原本的 baseUrl 保持向下相容
export const baseUrl = `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.original}/`;