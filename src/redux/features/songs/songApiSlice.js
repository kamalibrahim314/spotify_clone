// redux/features/songs/songApiSlice.js
import { apiSlice } from "../../app/api/apiSlice";

export const songApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addSong: builder.mutation({
            query: (formData) => ({
                url: "/song/add",
                method: "POST",
                body: formData,
            }),
        }),
        listSongs: builder.query({
            query: () => "/song/list",
        }),
        albumSongs: builder.query({
            query: (id) => `/song/list/${id}`,
        }),
        removeSong: builder.mutation({
            query: (id) => ({
                url: `/song/remove/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useAddSongMutation,
    useListSongsQuery,
    useAlbumSongsQuery,
    useRemoveSongMutation,
} = songApiSlice;
