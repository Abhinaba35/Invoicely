import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";

const AppContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
    return useContext(AppContext);
}

const AppContextProvider = ({ children }) => {
    const [appLoading, setAppLoading] = useState(true);
    const [user, setUser] = useState({ isAuthenticated: false });

    const getUserDetails = async () => {
        try {
            setAppLoading(true);
            const resp = await axiosInstance.get("/users");
            if (resp.data.isSuccess) {
                setUser({
                    isAuthenticated: true,
                    ...resp.data.data.user,
                });
            }
        } catch (err) {
            // Only show error if not 401 (unauthenticated), to avoid popup on Home
            if (err.response?.status !== 401) {
                ErrorToast("Error in user validation", err.message);
            }
        } finally {
            setAppLoading(false);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const valueObj = {
        appLoading,
        user,
        setUser,
    };

    return <AppContext.Provider value={valueObj}>{children}</AppContext.Provider>;
};

export { AppContextProvider };
