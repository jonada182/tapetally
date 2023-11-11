import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import useGetToken from "@/hooks/useGetToken";

type Props = {
    children: React.ReactNode;
};

type AuthContextType = {
    accessToken: string | null;
    isAuthenticated: boolean;
    error: AxiosError | null;
    isLoading: boolean;
    reuthenticate: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export const AuthContextProvider = ({ children }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [authCode, setAuthCode] = useState<string | null>(null);
    const {
        data: tokenData,
        error: error,
        isLoading: isLoading,
        refresh,
    } = useGetToken({ code: authCode, refreshToken: refreshToken });

    useEffect(() => {
        const storedAccessToken = sessionStorage.getItem("access_token");
        const storedRefreshToken = sessionStorage.getItem("refresh_token");
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
    }, []);

    useEffect(() => {
        const token = searchParams.get("token");
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        if (code && code !== authCode) {
            setAuthCode(code);
        } else if (error) {
            console.log("Error occured:", error);
        }
        if (token) {
            setAccessToken(token)
        }
        // Clean up query params
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("code")
        newSearchParams.delete("token")
        router.push(pathname + "?" + newSearchParams.toString())
    }, [router, searchParams]);

    useEffect(() => {
        if (tokenData && tokenData.access_token) {
            setAccessToken(tokenData.access_token);
            sessionStorage.setItem("access_token", tokenData.access_token);
            if (tokenData.refresh_token) {
                setRefreshToken(tokenData.refresh_token);
                sessionStorage.setItem("refresh_token", tokenData.refresh_token);
            }
        }

        () => {
            setAuthCode(null);
        };
    }, [tokenData]);

    useEffect(() => {
        if (error) {
            setAccessToken(null);
            setRefreshToken(null);
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");
        }
    }, [error]);

    const contextValues: AuthContextType = useMemo(
        () => ({
            accessToken,
            isAuthenticated: !!accessToken,
            error: error,
            isLoading: isLoading,
            reuthenticate: () => refresh(),
        }),
        [accessToken, error, isLoading],
    );

    return (
        <AuthContext.Provider value={contextValues}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within a PageProvider");
    }
    return context;
};
