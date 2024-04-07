import { apiSlice } from "./apiSlice";
import { KEY_URL } from "../constants";

export const googleMapApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getGoogleMapApiKey: builder.query ({
            query: () => ({
                url: `${KEY_URL}/google-map-key`,
                method: 'GET'
            }),
            keepUnusedDataFor: 5,
            invalidatesTags: ['Keys']
        }),  
    })
})

export const {useGetGoogleMapApiKeyQuery} = googleMapApiSlice