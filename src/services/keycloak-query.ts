import { axiosBaseQuery } from '../utils';
import { createApi } from '@reduxjs/toolkit/query/react';
import { userInst } from './instance';

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
			query: (userId) => ({
				url: `/users/${userId}`,
				method: 'GET',
			}),
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
			transformResponse({
				id,
				email,
				firstName,
				lastName,
			}: UserRepresentation) {
				const data: UserMetadata = {
					id,
					email,
					firstName,
					lastName,
				};
				return data;
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetByIdQuery, useGetAllUsersByRoleQuery } = keycloakApi;
