// redux/features/albums/albumApiSlice.js
import { apiSlice } from "../../app/api/apiSlice";

export const albumApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addAlbum: builder.mutation({
            query: (formData) => ({
                url: "/album/add",
                method: "POST",
                body: formData,
            }),
        }),
        listAlbums: builder.query({
            query: () => "/album/list",
        }),
        album: builder.query({
            query: (id) => `/album/list/${id}`,
        }),
        removeAlbum: builder.mutation({
            query: (id) => ({
                url: `/album/remove/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useAddAlbumMutation,
    useListAlbumsQuery,
    useAlbumQuery,
    useRemoveAlbumMutation,
} = albumApiSlice;
