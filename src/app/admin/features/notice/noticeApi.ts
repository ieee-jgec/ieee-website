import { baseApi } from "../baseApi";

export const noticeApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints(build) {
        return {

            getNotices: build.query<any, void>({
                query: () => `/notice/get-list`,
                providesTags: (result) => result?.notices ? [...result.notices.map(({ id }: { id: any }) => ({ type: "Notice", id })),
                { type: "Notice", id: "List" }
                ]
                    : [{ type: "Notice", id: "List" }]
            }),

            getNoticeById: build.query({
                query: (noticeId) => `/notice/get?id=${noticeId}`,
                providesTags: (result, error, noticeId) => [
                    { type: "Notice", id: noticeId }
                ],
            }),

            createNotice: build.mutation({
                query(body) {
                    return {
                        url: "/notice/create",
                        method: "POST",
                        body
                    }
                },
                invalidatesTags:["Notice"]
            })
        }
    }
});

export const { useGetNoticesQuery, useGetNoticeByIdQuery, useCreateNoticeMutation } = noticeApi;