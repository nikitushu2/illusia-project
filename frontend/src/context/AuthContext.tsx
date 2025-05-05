import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { ApplicationUser, UserRole } from "../types/applicationUser";
import { ApiErrorType, ApiRole, useFetch } from "../hooks/useFetch";

interface AuthProviderProp {
  children: React.ReactNode;
}
export enum AuthErrorType {
  USER_NOT_FOUND = "User not found",
  LOGIN_FAILED = "Login failed",
  LOGOUT_FAILED = "Logout failed",
}

interface AuthContextType {
    applicationUser: ApplicationUser | null;
    loading: boolean;
    authError?: AuthErrorType;
    login: () => void;
    logout: () => void;
    isLoggedIn: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    signUpUser?: User;
    signUp: () => void;
}

const authContextInitialValue = {
    applicationUser: null,
    loading: false,
    login: () => {},
    logout: () => {},
    isLoggedIn: false,
    isAdmin: false,
    isSuperAdmin: false,
    signUp: () => {},
}

const AuthContext = createContext<AuthContextType>(authContextInitialValue);

export const AuthProvider = ({ children }: AuthProviderProp) => {
    const { data: applicationUser, apiError, loading, post } = useFetch<ApplicationUser>(ApiRole.PUBLIC);

  const [signUpUser, setSignUpUser] = useState<User>();
  const [authError, setAuthError] = useState<AuthErrorType>();

    const fetchApplicationUserAndSetState = async (firebaseUser: User) => {
        const token = await firebaseUser.getIdToken();
        await post('/auth/login', { token })
        if (apiError === ApiErrorType.NOT_FOUND) {
            setAuthError(AuthErrorType.USER_NOT_FOUND);
            setSignUpUser(firebaseUser);
        } else if (apiError === ApiErrorType.SOMETHING_WENT_WRONG) {
            setAuthError(AuthErrorType.LOGIN_FAILED);
        }
    };

    const logoutUser = async () => {
        await post('/auth/logout', null);
        if (apiError === ApiErrorType.SOMETHING_WENT_WRONG) {
            setAuthError(AuthErrorType.LOGOUT_FAILED);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                fetchApplicationUserAndSetState(firebaseUser);
            } else {
                if (applicationUser) {
                    logoutUser();
                }
            }
        })
        return () => unsubscribe();
    }, []);  

    const login = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                await fetchApplicationUserAndSetState(result.user);
            }
        } catch (error) {
            console.error("Login error:", error);
            setAuthError(AuthErrorType.LOGIN_FAILED);
        }
    };

    const signUp = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                setSignUpUser(result.user);
            }
        } catch (error) {
            console.error("Login error:", error);
            setAuthError(AuthErrorType.LOGIN_FAILED);
        }
    };

    const logout = () => {
        signOut(auth);
        logoutUser();
    }

    const context = {
        applicationUser: applicationUser,
        loading: loading,
        authError: authError,
        login: login,
        logout: logout,
        isLoggedIn: !!applicationUser && applicationUser.isApproved,
        isAdmin: !!applicationUser && applicationUser.isApproved && applicationUser.role !== UserRole.USER,
        isSuperAdmin: !!applicationUser && applicationUser.isApproved && applicationUser.role === UserRole.SUPER_ADMIN,
        signUpUser: signUpUser,
        signUp: signUp
    }

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);