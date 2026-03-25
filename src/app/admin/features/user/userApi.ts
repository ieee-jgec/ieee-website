import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: ({ body }: { body: { email: string; password: string } }) => ({
        url: "/user/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    logoutUser: build.mutation<any, void>({
      query: () => ({
        url: "/user/logout",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),

    getUser: build.query<any, void>({
      query: () => "/user/current-user",
      providesTags: ["User"],
    }),

    getUserList: build.query<any, void>({
      query: () => "/user/user-list",
      providesTags: ["Users"],
    }),

    updatePassword: build.mutation({
      query: (body) => ({
        url: "/user/update-password",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    updateRole: build.mutation({
      query: (body) => ({
        url: "/user/update-role",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, body) => [
        { type: "User", id: body.data._id },
      ],
    }),

    addUser: build.mutation({
      query: (body) => ({
        url: "/user/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserQuery,
  useGetUserListQuery,
  useUpdatePasswordMutation,
  useUpdateRoleMutation,
  useAddUserMutation,
} = userApi;
