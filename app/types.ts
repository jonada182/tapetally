export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type UserAccessToken = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
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
  external_urls: ExternalUrl[];
};

export type Artist = {
  id: string;
  name: string;
  href: string;
  external_urls: ExternalUrl[];
  genres?: string[];
  images?: Image[];
};

export type Track = {
  id: string;
  name: string;
  href: string;
  album: Album;
  artists: Artist[];
  external_urls: ExternalUrl[];
};
