export type UserAccessToken = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
};

export enum TimeRange {
    Short = "short_term",
    Medium = "medium_term",
    Long = "long_term",
}

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

export type Image = {
    url: string;
};

export type ExternalUrl = {
    spotify: string;
};

export type Album = {
    id: string;
    name: string;
    href: string;
    images?: Image[];
    external_urls: ExternalUrl;
};

export type Artist = {
    id: string;
    name: string;
    href: string;
    external_urls: ExternalUrl;
    genres?: string[];
    images?: Image[];
};

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

export type Track = {
    id: string;
    name: string;
    href: string;
    album: Album;
    artists: Artist[];
    external_urls: ExternalUrl;
};

export const trackMapper = (track: Track): Track => ({
    id: track.id,
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
