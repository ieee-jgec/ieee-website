import { baseApi } from "../baseApi";

export const teamApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints(build) {
        return {
            getTeam: build.query<any, void>({
                query: () => "/team/get-list",
                providesTags: ["Team"]
            }),
            getTeamById: build.query({
                query: (teamId) => `/team/get?id=${teamId}`,
                providesTags: ["Team"]
            }),
            getMemberList: build.query({
                query: (teamId) => `/team/member/get-list?teamId=${teamId}`,
                providesTags: ["Member"]
            }),
            createTeam: build.mutation<any, any>({
                query(body) {
                    return {
                        url: "/team/create",
                        method: "POST",
                        body,
                    }
                },
                invalidatesTags: ["Team"]
            }),
            createTeamMember: build.mutation<any, any>({
                query(body) {
                    return {
                        url: "/team/member/create",
                        method: "POST",
                        body,
                    }                    
                },
                invalidatesTags: ["Member"]
            })
        }
    },
})

export const { useGetTeamQuery, useGetTeamByIdQuery, useGetMemberListQuery, useCreateTeamMutation, useCreateTeamMemberMutation } = teamApi;