import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { ApplicationUser } from "../types/applicationUser";

interface AuthProviderProp {
    children: React.ReactNode;
}
export enum AuthErrorType {
    USER_NOT_FOUND = "User not found",
    LOGIN_FAILED = "Login failed",
    LOGOUT_FAILED = "Logout failed",
}

type UserRole = 'admin' | 'user' | null;

interface AuthContextType {
    applicationUser?: ApplicationUser;
    loading: boolean;
    error?: AuthErrorType;
    login: () => void;
    logout: () => void;
    isLoggedIn: boolean;
    signUpUser?: User;
    userRole: UserRole
}

const authContextInitialValue = {
    loading: false,
    login: () => {},
    logout: () => {},
    isLoggedIn: false,
}

const BACKEND_BASE_PATH = import.meta.env.VITE_BACKEND_ORIGIN + '/api'

const AuthContext = createContext<AuthContextType>(authContextInitialValue);

export const AuthProvider = ({children}: AuthProviderProp) => {
    const [applicationUser, setApplicationUser] = useState<ApplicationUser>();
    const [signUpUser, setSignUpUser] = useState<User>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<AuthErrorType>();

    const [userRole, setUserRole] = useState<UserRole>(null);

    const fetchApplicationUserAndSetState = async (firebaseUser: User) => {
        setLoading(true);
        try {
            const token = await firebaseUser.getIdToken();
            const response = await fetch(`${BACKEND_BASE_PATH}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
                credentials: 'include',
              });
            
            if (response.ok){
                const user = await response.json() as ApplicationUser;
                setApplicationUser(user);
                setUserRole(user.role as unknown as UserRole);
            } else if(response.status === 404) {
                setError(AuthErrorType.USER_NOT_FOUND);
                setSignUpUser(firebaseUser);
            }
            throw new Error("login failed");
        } catch (error) {
            setError(AuthErrorType.LOGIN_FAILED)
        } finally {
            setLoading(false)  
        }
    };

    const logout = async () => {
        const response = await fetch(`${BACKEND_BASE_PATH}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        });
        if (response.ok){
            setApplicationUser(undefined);
        } else {
            setError(AuthErrorType.LOGOUT_FAILED);
        }

    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in, get token and fetch application user
                await fetchApplicationUserAndSetState(firebaseUser);
            } else {
                // User is signed out
                setApplicationUser(undefined);
            }
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    const login = () => {
        signInWithRedirect(auth, provider)
    };

    const context = {
        applicationUser: applicationUser,
        loading: loading,
        error: error,
        login: login,
        logout: logout,
        isLoggedIn: !!applicationUser && applicationUser.isApproved,
        signUpUser: signUpUser,
        userRole: userRole,
    }

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);