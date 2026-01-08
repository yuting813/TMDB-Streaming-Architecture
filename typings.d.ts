export interface Genre {
	id: number;
	name: string;
}

export interface Movie {
	title?: string; // 電影名稱
	name?: string;  // 影集名稱
	backdrop_path: string;
	media_type?: string;
	release_date?: string;
	first_air_date: string;
	genre_ids: number[];
	id: number;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	vote_average: number;
	vote_count: number;
}

export interface Element {
	type: 'Bloopers' | 'Featurette' | 'Behind the Scenes' | 'Clip' | 'Trailer' | 'Teaser';
}
