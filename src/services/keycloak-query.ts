import { fetchAuthQuery } from '../utils';
import { createApi } from '@reduxjs/toolkit/query/react';

export const keycloakApi = createApi({
	reducerPath: 'keycloakApi',
	baseQuery: fetchAuthQuery({
		baseUrl: `${import.meta.env.VITE_KEYCLOAK_URL}/admin/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['User'],
	endpoints: (builder) => ({
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
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
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
export const { useGetByIdQuery } = keycloakApi;
