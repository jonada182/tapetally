import { SpotifyClient } from ".";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockImplementation(() => axios);

describe("SpotifyClient", () => {
    let spotifyClient: SpotifyClient;
    const mockAccessToken = "test_access_token";

    beforeEach(() => {
        spotifyClient = new SpotifyClient({ accessToken: mockAccessToken });
    });

    describe("getUserProfile", () => {
        it("should retrieve user profile successfully", async () => {
            const mockProfileData = {
                id: "user123",
            };
            mockedAxios.get.mockResolvedValue({ data: mockProfileData });

            const profile = await spotifyClient.getUserProfile();
            expect(profile).toEqual(mockProfileData);
            expect(mockedAxios.get).toHaveBeenCalledWith("/me");
        });

        it("should throw an error when API call fails", async () => {
            mockedAxios.get.mockRejectedValue(new Error("API Error"));

            await expect(spotifyClient.getUserProfile()).rejects.toThrow(
                "API Error",
            );
        });
    });
});
