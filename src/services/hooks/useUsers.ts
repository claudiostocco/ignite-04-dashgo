import { useQuery } from "react-query";

import { api } from "../api";

export type User = {
    id: string
    name: string
    email: string
    createdAt: string
}

export async function getUsers(): Promise<User[]> {
    // const { data } = await api.get('/users');
    const response = await api.get('/users');
    console.log(response);
    const { data } = response;
    console.log(data);
    const usersData = data.users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR',{
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }),
    }));
    return usersData;
}

export function useUsers() {
    return useQuery('users',getUsers, {
        staleTime: 30 * 1000, //30 seconds
    });
}