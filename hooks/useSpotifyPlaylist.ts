import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import { SpotifyClient } from "@/lib/SpotifyClient";
import {
    Artist,
    SpotifyPlaylist,
    TimeRange,
    Track,
    timeRangeLabels,
} from "@/app/types";
import { AxiosError } from "axios";

type MutationProps = {
    timeRange: TimeRange;
    tracks: Track[];
    topArtist?: Artist | undefined;
};

export const useSpotifyPlaylist = () => {
    const [playlistData, setPlaylistData] = useState<SpotifyPlaylist | null>(
        null,
    );
    const [progressMessage, setProgressMessage] = useState<string | null>(null);
    const [spotifyPlaylistId, setSpotifyPlaylistId] = useState<string | null>(
        null,
    );
    const { accessToken } = useAuthContext();

    const spotifyClient = new SpotifyClient({ accessToken: accessToken });

    useEffect(() => {
        const storedSpotifyPlaylistId = localStorage.getItem(
            "tapetally_spotify_playlist",
        );
        if (storedSpotifyPlaylistId) {
            setSpotifyPlaylistId(storedSpotifyPlaylistId);
        }
    }, []);

    const handleSpotifyPlaylist = async (props: MutationProps) => {
        setProgressMessage("Retrieving your Spotify profile");
        if (!props.tracks) {
            return;
        }
        try {
            return await spotifyClient.getUserProfile().then((user) => {
                setProgressMessage("Creating a new playlist");
                if (spotifyPlaylistId) {
                    spotifyClient.deleteSpotifyPlaylist(spotifyPlaylistId);
                }
                return spotifyClient
                    .createPublicPlaylist(
                        user.id,
                        "My Mixtape",
                        "My top songs from the " +
                            timeRangeLabels[props.timeRange],
                    )
                    .then((playlist) => {
                        setProgressMessage("Customizing new playlist");
                        localStorage.setItem(
                            "tapetally_spotify_playlist",
                            playlist.id,
                        );
                        setSpotifyPlaylistId(playlist.id);
                        return spotifyClient
                            .addPlaylistImage(playlist.id)
                            .then(() => {
                                setProgressMessage("Adding top tracks");
                                return spotifyClient
                                    .addPlaylistTracks(
                                        playlist.id,
                                        props.tracks,
                                    )
                                    .then(() => {
                                        if (props.topArtist) {
                                            setProgressMessage(
                                                "Adding your top artist tracks",
                                            );
                                            return spotifyClient
                                                .getArtistTopTracks(
                                                    props.topArtist,
                                                )
                                                .then((artistTracks) => {
                                                    const tracks =
                                                        artistTracks.slice(
                                                            0,
                                                            5,
                                                        );
                                                    return spotifyClient
                                                        .addPlaylistTracks(
                                                            playlist.id,
                                                            tracks,
                                                            5,
                                                        )
                                                        .then(() => {
                                                            setProgressMessage(
                                                                null,
                                                            );
                                                            setPlaylistData(
                                                                playlist,
                                                            );
                                                            return playlist;
                                                        });
                                                });
                                        } else {
                                            setProgressMessage(null);
                                            setPlaylistData(playlist);
                                            return playlist;
                                        }
                                    });
                            });
                    });
            });
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    };

    const { data, error, isLoading, isSuccess, mutate } = useMutation<
        SpotifyPlaylist | undefined,
        AxiosError,
        MutationProps
    >({
        mutationFn: handleSpotifyPlaylist,
        onError: () => {
            spotifyClient.deleteSpotifyPlaylist(spotifyPlaylistId);
        },
    });

    return {
        data,
        error,
        isLoading,
        isSuccess,
        progressMessage,
        playlistData,
        createSpotifyPlaylist: mutate,
    };
};
