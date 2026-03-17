import { baseApi } from "../baseApi";

export const noticeApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints(build) {
        return {
            getNotices: build.query<any, void>({
                query: () => `/notice/get-list`,
                providesTags: ["Notice"]
            })
        }
    }
});

export const { useGetNoticesQuery } = noticeApi;