import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (details) => ({
                url: `${USERS_URL}/auth`, 
                method: 'POST',
                body: details,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }),
        })
    })
})

export const {useLoginMutation, useRegisterMutation, useLogoutMutation} = usersApiSlice