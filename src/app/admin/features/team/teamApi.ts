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

            getMemberById: build.query({
                query: (memberId) => `/team/member/get?id=${memberId}`,
                providesTags(result, error, memberId) {
                    return ([
                        { type: "Member", id: memberId }
                    ])
                },
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
            }),

            deleteTeam: build.mutation({
                query: (teamId) => ({
                    url: `/team/remove?id=${teamId}`,
                    method: "DELETE"
                }),
                invalidatesTags(result, error, teamId) {
                    return ([
                        { type: "Team", id: teamId },
                        { type: "Team" },
                    ])
                },
            }),

            deleteTeamMember: build.mutation({
                query: (memberId) => ({
                    url: `/team/member/remove?id=${memberId}`,
                    method: "DELETE"
                }),
                invalidatesTags(result, error, memberId) {
                    return ([
                        { type: "Member", id: memberId },
                        { type: "Member" }
                    ])
                },
            }),

            updateTeam: build.mutation({
                query: ({ teamId, teamName, teamType }) => ({
                    url: "/team/update",
                    method: "PATCH",
                    body: { teamId, teamName, teamType }
                }),
                invalidatesTags: ["Team"]
            }),

            updateTeamMember: build.mutation({
                query: (body) => ({
                    url: "/team/member/update",
                    method: "PATCH",
                    body
                }),
                invalidatesTags(result, error, memberDetails) {
                    return ([
                        { type: "Member", id: memberDetails.memberId },
                        { type: "Member" }
                    ])
                },
            })
        }
    },
})

export const { useGetTeamQuery, useGetTeamByIdQuery, useGetMemberListQuery, useGetMemberByIdQuery, useCreateTeamMutation, useCreateTeamMemberMutation, useDeleteTeamMutation, useDeleteTeamMemberMutation, useUpdateTeamMutation, useUpdateTeamMemberMutation } = teamApi;