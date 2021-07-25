import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from 'nookies';

import { apiAuth } from "../services/api";

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}

type SignInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>;
    isAutenticated: boolean;
    user: User;
}

type AuthProviderProps = {
    children: ReactNode;
}

export function signOut() {
    destroyCookie(undefined, 'dashgo.token');
    destroyCookie(undefined, 'dashgo.refreshToken');

    if (process.browser) {
        Router.push('/');
    }
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [ user, setUser ] = useState<User>();
    const isAutenticated = !!user;

    useEffect(() => {
        const { 'dashgo.token': token } = parseCookies();
        if (token) {
            try {
                apiAuth.get('/me')
                    .then(response => {
                        const { email, permissions, roles } = response.data;
                        setUser({ email, permissions, roles });
                    })
                    .catch(error => console.log(error));
            } catch (error) {
                console.log(error);
                signOut();
            }
        }
    },[]);

    async function signIn({ email, password }: SignInCredentials) {
        // console.log({email, password});
        try {
            const response = await apiAuth.post('/sessions', {
                email,
                password,
            });
            const { permissions, roles, refreshToken, token } = response.data;
            setUser({ email, permissions, roles });

            setCookie(undefined,'dashgo.token',token,{
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/'
            });
            setCookie(undefined,'dashgo.refreshToken',refreshToken,{
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/'
            });

            apiAuth.defaults.headers['Authorization'] = `Bearer ${token}`;
            Router.push('/dashboard');
        } catch (error) {
            setUser(null);
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{isAutenticated, signIn, user}}>
            {children}
        </AuthContext.Provider>
    )
}