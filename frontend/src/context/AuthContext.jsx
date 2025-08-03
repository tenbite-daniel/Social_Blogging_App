import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        accessToken: null,
        user: null,
    });

    // Load auth state from localStorage on component mount
    useEffect(() => {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
            try {
                const parsedAuth = JSON.parse(storedAuth);
                setAuth(parsedAuth);
            } catch (error) {
                console.error('Error parsing stored auth:', error);
                localStorage.removeItem('auth');
            }
        }
    }, []);

    // Save auth state to localStorage whenever it changes
    const updateAuth = (newAuth) => {
        setAuth(newAuth);
        if (newAuth.accessToken) {
            localStorage.setItem('auth', JSON.stringify(newAuth));
        } else {
            localStorage.removeItem('auth');
        }
    };

    // Logout function
    const logout = () => {
        setAuth({ accessToken: null, user: null });
        localStorage.removeItem('auth');
    };

    return (
        <AuthContext.Provider value={{ 
            auth, 
            setAuth: updateAuth,
            logout,
            isAuthenticated: !!auth.accessToken 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);