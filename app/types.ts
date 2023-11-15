export type UserAccessToken = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
};

export enum TimeRange {
    // eslint-disable-next-line no-unused-vars
    Short = "short_term",
    // eslint-disable-next-line no-unused-vars
    Medium = "medium_term",
    // eslint-disable-next-line no-unused-vars
    Long = "long_term",
}

export const timeRangeLabels = {
    [TimeRange.Short]: "last 30 days",
    [TimeRange.Medium]: "last 6 months",
    [TimeRange.Long]: "last year",
};

export type ArtistsAPIResponse = {
    items: Artist[];
};

export type TracksAPIResponse = {
    items: Track[];
};

export type Trends = {
    artists: Artist[];
    tracks: Track[];
};

export interface Image {
    url: string;
}

export interface ExternalUrl {
    spotify: string;
}

export interface Album {
    id: string;
    name: string;
    href: string;
    images?: Image[];
    external_urls: ExternalUrl;
}

export interface Artist {
    id: string;
    name: string;
    href: string;
    external_urls: ExternalUrl;
    genres?: string[];
    images?: Image[];
}

export const artistMapper = (artist: Artist): Artist => ({
    id: artist.id,
    name: artist.name,
    href: artist.href,
    external_urls: artist.external_urls,
    genres: artist.genres || [],
    images: artist.images?.map((image) => ({
        url: image.url,
    })),
});

export interface Track {
    id: string;
    name: string;
    href: string;
    album: Album;
    artists: Artist[];
    external_urls: ExternalUrl;
    uri: string;
}

export const trackMapper = (track: Track): Track => ({
    id: track.id,
    uri: track.uri,
    name: track.name,
    href: track.href,
    external_urls: track.external_urls,
    album: {
        id: track.album.id,
        name: track.album.name,
        href: track.album.href,
        external_urls: track.album.external_urls,
        images: track.album.images?.map((image) => ({
            url: image.url,
        })),
    },
    artists: track.artists.map(artistMapper),
});

export interface SpotifyUserProfile {
    id: string;
    display_name: string;
    email: string;
    country: string;
    href: string;
    uri: string;
    external_urls: {
        spotify: string;
    };
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string;
    public: boolean;
    href: string;
    uri: string;
    images: Image[];
    tracks: Track[];
    external_urls: {
        spotify: string;
    };
}
