import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api"
    }),
    tagTypes:["Event","Notice", "Team", "Message", "Member"],
    endpoints: () => ({

    })
})