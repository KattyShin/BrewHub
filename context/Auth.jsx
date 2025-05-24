// Import necessary hooks and Firebase auth
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Create an authentication context with a default value
const AuthContext = createContext({ user: null });

// Context provider component that wraps your app and provides auth state
export const AuthContextProvider = ({ children }) => {
    // State to hold the current user
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Listen for changes in auth state (login/logout)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user); // Set the user state when auth state changes
        });

        // Cleanup: unsubscribe when the component unmounts
        return unsubscribe;
    }, []);

    return (
        // Provide the current user to all children components
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext in any component
export const useAuth = () => useContext(AuthContext);
