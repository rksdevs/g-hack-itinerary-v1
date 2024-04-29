import { apiSlice } from "./apiSlice";
import { ITINERARY_URL } from "../constants";

export const itineraryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addItinerary: builder.mutation({
            query: (details) => ({
                url: `${ITINERARY_URL}/addItinerary`,
                method: 'POST',
                body: details,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }),
        }),
        getAllItinerary: builder.query({
            query: () => ({
                url: `${ITINERARY_URL}/myItineraries`,
                method: 'GET',
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }),
            keepUnusedDataFor: 5
        }),
        getOneItinerary: builder.query({
            query: (id) => ({
                url: `${ITINERARY_URL}/${id}`,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }),
            keepUnusedDataFor: 5
        }),
    })
})

export const { useAddItineraryMutation, useGetAllItineraryQuery, useGetOneItineraryQuery} = itineraryApiSlice;