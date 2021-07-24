import axios from 'axios';
import { parseCookies } from 'nookies';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

const cookies = parseCookies();

export const apiAuth = axios.create({
    baseURL: 'http://localhost:3333/',
    headers: {
        Authorization: `Bearer ${cookies['dashgo.token']}`
    }
});