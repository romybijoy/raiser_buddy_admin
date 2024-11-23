import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "http://65.0.130.14" });

export const ApiSlice = createApi({
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
