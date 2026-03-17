import { baseApi } from "../baseApi";

export const teamApi = baseApi.injectEndpoints({
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
                query: (teamId)=> `/team/member/get-list?teamId=${teamId}`,
                providesTags: ["Team"]
            })
        }
    },
})

export const { useGetTeamQuery, useGetTeamByIdQuery, useGetMemberListQuery } = teamApi;