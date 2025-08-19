'use client'
// context/AuthContext.js

import { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged, 
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup 
} from "firebase/auth";
import { auth } from "../lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Function to sign up a user with email and password
    const signUpWithEmail = async (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Function to sign in a user with email and password
    const signInWithEmail = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Function to sign in a user with a Google pop-up
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    // Function to sign out the current user
    const logout = async () => {
        await signOut(auth);
    };

    const value = {
        user,
        loading,
        logout,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);