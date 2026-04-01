import { baseApi } from "../baseApi";

export const messageApi = baseApi.injectEndpoints({
    endpoints(build) {
        return {
            getMessages: build.query({
                query: (filter) => `/message/get-list?filter=${filter}`
            })
        }
    }
})

export const { useGetMessagesQuery } = messageApi;