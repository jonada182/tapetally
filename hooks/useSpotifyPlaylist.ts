import axios from "axios";
import { useMutation } from "react-query";
import { Artist, TimeRange, Track, timeRangeLabels } from "@/app/types";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { playlistBase64Image } from "@/lib/playlist_img";

type Props = {
    timeRange: TimeRange;
    tracks: Track[];
    topArtist?: Artist | undefined;
};

export const useSpotifyPlaylist = () => {
    const [progressMessage, setProgressMessage] = useState<string | null>(null);
    const [spotifyPlaylistId, setSpotifyPlaylistId] = useState<string | null>(
        null,
    );
    const { accessToken } = useAuthContext();

    useEffect(() => {
        const storedSpotifyPlaylistId = localStorage.getItem(
            "tapetally_spotify_playlist",
        );
        if (storedSpotifyPlaylistId) {
            setSpotifyPlaylistId(storedSpotifyPlaylistId);
        }
    }, []);

    const spotifyAPI = axios.create({
        baseURL: "https://api.spotify.com/v1",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const getUserProfile = () => {
        return spotifyAPI
            .get("/me")
            .then((response) => {
                console.log("Spotify profile retrieved");
                return response.data;
            })
            .catch((error) => {
                console.log(
                    "Error when fetching spotify profile:",
                    error.message,
                );
                throw error;
            });
    };

    const createPublicPlaylist = (
        userId: string,
        name: string,
        description: string,
    ) => {
        return spotifyAPI
            .post(`/users/${userId}/playlists`, {
                name: name,
                description: description,
                public: true,
            })
            .then((response) => {
                console.log("Playlist created");
                return response.data;
            })
            .catch((error) => {
                console.log("Error when creating playlist:", error.message);
                throw error;
            });
    };

    const deleteSpotifyPlaylist = (id: string | null) => {
        if (id) {
            return spotifyAPI
                .delete(`/playlists/${id}/followers`)
                .then((response) => {
                    if (response.status == 200) {
                        console.log("Spotify playlist has been deleted");
                    }
                });
        }
    };

    const addPlaylistImage = (playlistId: string) => {
        return spotifyAPI
            .put(`/playlists/${playlistId}/images`, playlistBase64Image, {
                headers: {
                    "Content-Type": "image/jpeg",
                    ...spotifyAPI.defaults.headers.common,
                },
            })
            .then((response) => {
                if (response.status == 202) {
                    console.log("Playlist image uploaded");
                    return response;
                }
            })
            .catch((error) => {
                console.log(
                    "Error when adding image to playlist:",
                    error.message,
                );
                throw error;
            });
    };

    const addPlaylistTracks = (
        playlistId: string,
        tracks: Track[],
        position: number = 0,
    ) => {
        return spotifyAPI
            .post(`/playlists/${playlistId}/tracks`, {
                uris: tracks?.map((track) => track.uri),
                position: position,
            })
            .then((response) => {
                if (response.status == 201) {
                    console.log("Tracks added to playlist");
                    return response;
                }
            })
            .catch((error) => {
                console.log(
                    "Error when adding tracks to playlist:",
                    error.message,
                );
                throw error;
            });
    };

    const getArtistTopTracks = (artist: Artist) => {
        return spotifyAPI
            .get<{ tracks: Track[] }>(
                `/artists/${artist.id}/top-tracks?market=US`,
            )
            .then((response) => {
                return response.data?.tracks;
            })
            .catch((error) => {
                console.log(
                    "Error when fetching top artist top tracks:",
                    error.message,
                );
                throw error;
            });
    };

    const handleSpotifyPlaylist = async (props: Props) => {
        setProgressMessage("Retrieving your Spotify profile");
        if (!props.tracks) {
            return;
        }
        try {
            return await getUserProfile().then((user) => {
                setProgressMessage("Creating a new playlist");
                if (spotifyPlaylistId) {
                    deleteSpotifyPlaylist(spotifyPlaylistId);
                }
                createPublicPlaylist(
                    user.id,
                    "My Mixtape",
                    "My top songs from the " + timeRangeLabels[props.timeRange],
                ).then((playlist) => {
                    setProgressMessage("Customizing new playlist");
                    localStorage.setItem(
                        "tapetally_spotify_playlist",
                        playlist.id,
                    );
                    setSpotifyPlaylistId(playlist.id);
                    addPlaylistImage(playlist.id).then(() => {
                        setProgressMessage("Adding top tracks");
                        addPlaylistTracks(playlist.id, props.tracks).then(
                            () => {
                                if (props.topArtist) {
                                    setProgressMessage(
                                        "Adding top artist tracks",
                                    );
                                    getArtistTopTracks(props.topArtist).then(
                                        (artistTracks) => {
                                            const tracks = artistTracks.slice(
                                                0,
                                                5,
                                            );
                                            addPlaylistTracks(
                                                playlist.id,
                                                tracks,
                                                5,
                                            ).then(() => {
                                                setProgressMessage(
                                                    "Playlist is ready",
                                                );
                                            });
                                        },
                                    );
                                } else {
                                    setProgressMessage("Playlist is ready");
                                }
                            },
                        );
                    });
                });
            });
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    };

    const { data, error, isLoading, isSuccess, mutate } = useMutation({
        mutationKey: ["create_playlist"],
        mutationFn: handleSpotifyPlaylist,
        onError: () => {
            deleteSpotifyPlaylist(spotifyPlaylistId);
        },
    });

    return {
        data,
        error,
        isLoading,
        isSuccess,
        progressMessage,
        createSpotifyPlaylist: mutate,
    };
};
