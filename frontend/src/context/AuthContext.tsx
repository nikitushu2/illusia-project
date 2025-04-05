import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { ApplicationUser } from "../../../types/applicationUser";

interface AuthProviderProp {
    children: React.ReactNode;
}
export enum AuthErrorType {
    USER_NOT_FOUND = "User not found",
    LOGIN_FAILED = "Login failed",
}

export enum UserType {
    ADMIN = "admin",
    USER = "user",
    SUPER_ADMIN = "super_admin"
}

interface AuthContextType {
    applicationUser?: ApplicationUser;
    loading: boolean;
    error?: AuthErrorType;
    authenticateWithGoogle: () => void;
    isLoggedIn: boolean;
    userType?: UserType;
    signUpUser?: User;
}

const authContextInitialValue = {
    loading: false,
    authenticateWithGoogle: () => {},
    isLoggedIn: false,
}

const AuthContext = createContext<AuthContextType>(authContextInitialValue);

export const AuthProvider = ({children}: AuthProviderProp) => {
    const [applicationUser, setApplicationUser] = useState<ApplicationUser>();
    const [signUpUser, setSignUpUser] = useState<User>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<AuthErrorType>();

    const fetchApplicationUserAndSetState = async (firebaseUser: User) => {
        setLoading(true);
        try {
            const token = await firebaseUser.getIdToken();
            const response = await fetch("http://localhost:3000/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
              });
            
            if (response.ok){
                const user = await response.json() as ApplicationUser;
                setApplicationUser(user);
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

    const authenticateWithGoogle = () => {
        signInWithRedirect(auth, provider)
    }

    const getUserType = (role?: string): UserType | undefined => {
        if (!role) return undefined;
        
        const roleMap: Record<string, UserType> = {
            "admin": UserType.ADMIN,
            "user": UserType.USER,
            "super-admin": UserType.SUPER_ADMIN
        };
        
        return roleMap[role];
    };

    const context = {
        applicationUser: applicationUser,
        loading: loading,
        error: error,
        authenticateWithGoogle: authenticateWithGoogle,
        userType: getUserType(applicationUser?.role),
        isLoggedIn: !!applicationUser && applicationUser.isApproved,
        signUpUser: signUpUser
    }

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);