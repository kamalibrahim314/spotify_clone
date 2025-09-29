import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';

const baseUrl = import.meta.env.REACT_APP_API_URL || 'https://spotify-backend-wine.vercel.app';

const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = Cookies.get("accessToken");
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (args.url?.includes('/auth/signin') || args.url?.includes('/auth/signup')) {
        return result;
    }

    if (result.error?.status === 401 || result.error?.status === 403) {
        try {
            const refreshResult = await baseQuery(
                { url: '/auth/refresh', method: 'POST' },
                api,
                extraOptions
            );

            if (refreshResult?.data?.accessToken) {
                Cookies.set('accessToken', refreshResult.data.accessToken, {
                    secure: true,
                    sameSite: 'strict'
                });

                result = await baseQuery(args, api, extraOptions);
            } else {
                if (!window.location.pathname.includes('/login')) {
                    Cookies.remove('accessToken');
                    window.location.href = '/';
                }
            }
        } catch (error) {
            console.error('فشل تجديد التوكن:', error);
            if (!window.location.pathname.includes('/login')) {
                Cookies.remove('accessToken');
                window.location.href = '/';
            }
        }
    }
    return result;
};

export const apiSlice = createApi({ reducerPath: 'api', baseQuery: baseQueryWithReauth, tagTypes: ['User', 'Courses', 'Enrollment', 'Notification', 'Student'], endpoints: () => ({}), });