import { baseApi } from "../baseApi";

export const eventApi = baseApi.injectEndpoints({
    
    endpoints(build) {
        return {
            getEvents: build.query<any,void>({
                query: () => "/event/get-all",
                providesTags: ["Event"]
            }),
            getEventById: build.query({
                query: (eventId) => `/event/get?id=${eventId}`
            })
        }
    },
});

export const {useGetEventsQuery, useGetEventByIdQuery} = eventApi