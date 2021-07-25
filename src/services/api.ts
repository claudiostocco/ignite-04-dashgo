import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

import { signOut } from '../contexts/AuthContext';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

let isRefreshing = false;
let failedRequestsQueue = [];

export const apiAuth = axios.create({
    baseURL: 'http://localhost:3333/',
    headers: {
        Authorization: `Bearer ${parseCookies()['dashgo.token']}`
    }
});

apiAuth.interceptors.response.use(
    responseSuccess => responseSuccess,
    (responseError: AxiosError) => {
        // console.log('responseError.response', responseError.response);
        if (responseError.response.status === 401) {
            if (responseError.response.data?.code === 'token.expired') {
                const { 'dashgo.refreshToken': refreshToken } = parseCookies();
                const originalConfig = responseError.config;

                if (!isRefreshing) {
                    isRefreshing = true;
                    apiAuth.post('/refresh', {refreshToken })
                        .then(response => {
                            // console.log(response);
                            const { refreshToken: newRefreshToken, token } = response.data;
                
                            setCookie(undefined,'dashgo.token',token,{
                                maxAge: 30 * 24 * 60 * 60, // 30 days
                                path: '/'
                            });
                            setCookie(undefined,'dashgo.refreshToken',newRefreshToken,{
                                maxAge: 30 * 24 * 60 * 60, // 30 days
                                path: '/'
                            });        
                            apiAuth.defaults.headers['Authorization'] = `Bearer ${token}`;

                            failedRequestsQueue.forEach(request => request.onSuccess(token));
                            failedRequestsQueue = [];
                        })
                        .catch(err => {
                            failedRequestsQueue.forEach(request => request.onFailure(err));
                            failedRequestsQueue = [];
                        })
                        .finally(() => isRefreshing = false)
                    ;
                }
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({
                        onSuccess: (token: string) => {
                            // console.log('Chamando onSuccess:', {token, originalConfig});
                            originalConfig.headers['Authorization'] = `Bearer ${token}`;
                            resolve(api(originalConfig));
                        },
                        onFailure: (err: AxiosError) => {
                            // console.log('Chamando onFailure:', err);
                            reject(err);
                        },
                    })
                });
            } else {
                signOut();
            }
        }
        return Promise.reject(responseError);
    }
);