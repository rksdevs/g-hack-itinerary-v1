import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants.js";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (details) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: details
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data,
            })
        })
    })
})

export const {useLoginMutation, useRegisterMutation} = usersApiSlice