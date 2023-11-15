import axios, { AxiosInstance, HttpStatusCode } from "axios";
import {
    Artist,
    SpotifyPlaylist,
    SpotifyUserProfile,
    Track,
} from "@/app/types";

type SpotifyClientProps = {
    accessToken: string | null;
};

/**
 * A client to interact with the Spotify API
 */
export class SpotifyClient {
    public baseUrl = "https://api.spotify.com/v1";
    private API: AxiosInstance;

    /**
     * @param accessToken string - access token for Spotify API
     */
    constructor({ accessToken }: SpotifyClientProps) {
        this.API = axios.create({
            baseURL: this.baseUrl,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (accessToken) {
            this.API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        }
    }

    /**
     * Retrieves the user's Spotify profile.
     * @returns {Promise<SpotifyUserProfile>} A promise that resolves to the user's profile data.
     * @throws Throws an error if the profile retrieval fails.
     */
    public getUserProfile = async (): Promise<SpotifyUserProfile> => {
        try {
            const response = await this.API.get<SpotifyUserProfile>("/me");
            console.info("Spotify profile retrieved");
            return response.data;
        } catch (error: any) {
            console.error(
                "Error when fetching spotify profile:",
                error.message,
            );
            throw error;
        }
    };

    /**
     * Creates a public playlist on Spotify.
     * @param {string} userId - The Spotify user ID.
     * @param {string} name - The name of the playlist.
     * @param {string} description - A description for the playlist.
     * @returns {Promise<SpotifyPlaylist>} A promise that resolves to the data of the created playlist.
     * @throws Throws an error if the playlist creation fails.
     */
    public createPublicPlaylist = async (
        userId: string,
        name: string,
        description: string,
    ): Promise<SpotifyPlaylist> => {
        try {
            const response = await this.API.post<SpotifyPlaylist>(
                `/users/${userId}/playlists`,
                {
                    name: name,
                    description: description,
                    public: true,
                },
            );
            console.info("Playlist created");
            return response.data;
        } catch (error: any) {
            console.error("Error when creating playlist:", error.message);
            throw error;
        }
    };

    /**
     * Deletes a Spotify playlist.
     * @param {string|null} id - The ID of the playlist to be deleted.
     * @returns {Promise<boolean>} A promise that resolves to the response of the delete operation, or undefined if the id is null.
     * @throws Throws an error if the delete operation fails.
     */
    public deleteSpotifyPlaylist = async (
        id: string | null,
    ): Promise<boolean> => {
        if (id) {
            try {
                const response = await this.API.delete(
                    `/playlists/${id}/followers`,
                );

                if (response.status == HttpStatusCode.Ok) {
                    console.info("Spotify playlist has been deleted");
                    return true;
                } else {
                    console.info("Spotify playlist could not been deleted");
                    return false;
                }
            } catch (error: any) {
                console.error("Error when deleting playlist:", error.message);
                throw error;
            }
        }

        return false;
    };

    /**
     * Adds an image to a Spotify playlist.
     * @param {string} playlistId - The ID of the playlist.
     * @returns {Promise<boolean>} A promise that resolves to the response of the image upload operation.
     * @throws Throws an error if the image upload fails.
     * @remarks Assumes `playlistBase64Image` is a base64-encoded image string in scope.
     */
    public addPlaylistImage = async (playlistId: string): Promise<boolean> => {
        try {
            const imagePath = "/img/playlist_cover.jpg";
            const playlistBase64Image = await axios
                .get(imagePath, { responseType: "arraybuffer" })
                .then((response) => {
                    return Buffer.from(response.data, "binary").toString(
                        "base64",
                    );
                });
            const response = await this.API.put(
                `/playlists/${playlistId}/images`,
                playlistBase64Image,
                {
                    headers: {
                        "Content-Type": "image/jpeg",
                        ...this.API.defaults.headers.common,
                    },
                },
            );

            if (response.status == HttpStatusCode.Accepted) {
                console.info("Playlist image uploaded");
                return true;
            } else {
                console.info("Playlist image could not be uploaded");
                return false;
            }
        } catch (error: any) {
            console.error(
                "Error when adding image to playlist:",
                error.message,
            );
            throw error;
        }
    };

    /**
     * Adds tracks to a Spotify playlist.
     * @param {string} playlistId - The ID of the playlist.
     * @param {Track[]} tracks - An array of `Track` objects to add.
     * @param {number} [position=0] - The position in the playlist where the tracks should be added.
     * @returns {Promise<boolean>} A promise that resolves to the response of the track addition operation.
     * @throws Throws an error if adding tracks fails.
     */
    public addPlaylistTracks = async (
        playlistId: string,
        tracks: Track[],
        position: number = 0,
    ): Promise<boolean> => {
        try {
            const response = await this.API.post(
                `/playlists/${playlistId}/tracks`,
                {
                    uris: tracks?.map((track) => track.uri),
                    position: position,
                },
            );
            if (response.status == HttpStatusCode.Created) {
                console.info("Tracks added to playlist");
                return true;
            } else {
                console.info("Tracks were not added to playlist");
                return false;
            }
        } catch (error: any) {
            console.error(
                "Error when adding tracks to playlist:",
                error.message,
            );
            throw error;
        }
    };

    /**
     * Retrieves the top tracks of a given artist from Spotify.
     * @param {Artist} artist - The artist object containing the artist's ID.
     * @returns {Promise<Track[]>} A promise that resolves to an array of the artist's top tracks.
     * @throws Throws an error if the retrieval of top tracks fails.
     */
    public getArtistTopTracks = async (artist: Artist): Promise<Track[]> => {
        try {
            const response = await this.API.get<{ tracks: Track[] }>(
                `/artists/${artist.id}/top-tracks?market=US`,
            );
            return response.data?.tracks;
        } catch (error: any) {
            console.error(
                "Error when fetching top artist top tracks:",
                error.message,
            );
            throw error;
        }
    };
}
