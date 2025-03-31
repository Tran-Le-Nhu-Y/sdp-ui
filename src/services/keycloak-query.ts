import { axiosBaseQuery } from '../utils';
import { createApi } from '@reduxjs/toolkit/query/react';
import { userInst } from './instance';
import { getUserMetadata } from './api/keycloak-api';
import { AxiosError } from 'axios';

export const keycloakApi = createApi({
	reducerPath: 'keycloakApi',
	baseQuery: axiosBaseQuery(userInst),
	tagTypes: ['UsersHasRole', 'User'],
	endpoints: (builder) => ({
		getAllUsersByRole: builder.query<Array<UserMetadata>, ResourceRoles>({
			query: (role) => ({
				url: `/clients/${import.meta.env.VITE_KEYCLOAK_RESOURCE_CLIENT_ID}/roles/${role}/users`,
				method: 'GET',
				params: { briefRepresentation: true },
			}),
			providesTags(result, _err, arg) {
				const role = arg;
				return result
					? [
							{
								type: 'UsersHasRole',
								id: role,
							} as const,
						]
					: [];
			},
		}),
		getById: builder.query<UserMetadata, string>({
			async queryFn(arg) {
				const userId = arg;
				try {
					const user = await getUserMetadata(userId);
					return { data: user };
				} catch (error) {
					const axiosError = error as AxiosError;
					return {
						error: {
							status: axiosError.response?.status ?? 500,
							statusText: axiosError.message,
							data: axiosError.response?.data,
						},
					};
				}
			},
			providesTags(result) {
				return result
					? [
							{
								type: 'User',
								id: result.id,
							} as const,
						]
					: [];
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetByIdQuery, useGetAllUsersByRoleQuery } = keycloakApi;
