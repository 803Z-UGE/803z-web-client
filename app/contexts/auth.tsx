// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { accountMyselfRetrieve, accountLogin, type User, usersCreate } from '@/api/';
import { useLocalStorage } from 'usehooks-ts';
import { client } from '@/api/client.gen';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | undefined;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    token?: string; // Optional token if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | undefined>();
    const [token, setToken, removeToken] = useLocalStorage<string | undefined>('token', undefined); // Optional token state

    async function checkAuth() {
        setIsLoading(true);
        try {
            const fetch = await accountMyselfRetrieve();

            if (fetch.response.ok && fetch.data) {
                setIsAuthenticated(true);
                setUser(fetch.data);
            } else {
                throw Error('Login failed for unknown reasons : ' + JSON.stringify(fetch));
            }
        } catch {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }

    function updateToken(token: string) {
        setToken(token);
        client.setConfig({
            baseUrl: 'http://localhost:8000',
            headers: {
                Authorization: `Token ${token}`,
            },
        });
    }

    useEffect(() => {
        if (token) updateToken(token);
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const fetch = await accountLogin({ body: { email, password } });
            // Set token in local storage or state management
            if (fetch.error) {
                throw Error('Login failed: ' + fetch.error);
            }
            if (fetch.response.ok && fetch.data) {
                console.log('Login successful:', fetch.data);
                updateToken(fetch.data.token);
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            await checkAuth();
        }
    };

    const signup = async (email: string, firstName: string, lastName: string, password: string) => {
        try {
            const fetch = await usersCreate({
                body: {
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    password, // Assuming password is required for signup
                },
            });
            if (fetch.error) {
                throw Error('Signup failed: ' + fetch.error);
            }
            if (fetch.response.ok && fetch.data) {
                console.log('Signup successful:', fetch.data);
                setToken(fetch.data.token);
            }
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        } finally {
            await checkAuth();
        }
    };

    const logout = () => {
        removeToken(); // Clear token from local storage
        setIsAuthenticated(false);
        setUser(undefined);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};
