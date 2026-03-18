import { baseApi } from "../baseApi";

export const eventApi = baseApi.injectEndpoints({

    endpoints(build) {
        return {
            getEvents: build.query<any, void>({
                query: () => "/event/get-all",
                providesTags: ["Event"]
            }),
            getEventById: build.query({
                query: (eventId) => `/event/get?id=${eventId}`
            }),
            createEvent: build.mutation<any, any>({
                query(body) {
                    return {
                        url: "/event/create",
                        method: "POST",
                        body,
                    }
                },
                invalidatesTags: ["Event"]

            })
        }
    },
});

export const { useGetEventsQuery, useGetEventByIdQuery, useCreateEventMutation } = eventApi