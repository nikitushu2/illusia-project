import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
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


interface AuthContextType {
    applicationUser?: ApplicationUser;
    loading: boolean;
    error?: AuthErrorType;
    login: () => void;
    logout: () => void;
    isLoggedIn: boolean;
    signUpUser?: User;
    signUp: () => void;
}

const authContextInitialValue = {
    loading: false,
    login: () => {},
    logout: () => {},
    isLoggedIn: false,
    signUp: () => {},
}

const BACKEND_BASE_PATH = import.meta.env.VITE_BACKEND_ORIGIN + "/api";

const AuthContext = createContext<AuthContextType>(authContextInitialValue);

export const AuthProvider = ({ children }: AuthProviderProp) => {
  const [applicationUser, setApplicationUser] = useState<ApplicationUser>();
  const [signUpUser, setSignUpUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AuthErrorType>();


    const fetchApplicationUserAndSetState = async (firebaseUser: User) => {
        try {
            setLoading(true);
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
               // setUserRole(user.role as unknown as UserRole);
            } else if(response.status === 404) {
                setError(AuthErrorType.USER_NOT_FOUND);
                setSignUpUser(firebaseUser);
            }

        } catch (error) {
            setError(AuthErrorType.LOGIN_FAILED)
        } finally {
            setLoading(false)  
        }
    };

    const logoutUser = async () => {
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
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                fetchApplicationUserAndSetState(firebaseUser);
            } else {
                if (applicationUser) {
                    setApplicationUser(undefined);
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
            setError(AuthErrorType.LOGIN_FAILED);
            setLoading(false);
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
            setError(AuthErrorType.LOGIN_FAILED);
            setLoading(false);
        }
    };

    const logout = () => {
        signOut(auth);
        logoutUser();
    }

    const context = {
        applicationUser: applicationUser,
        loading: loading,
        error: error,
        login: login,
        logout: logout,
        isLoggedIn: !!applicationUser && applicationUser.isApproved,
        signUpUser: signUpUser,
        signUp: signUp
    }

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 
