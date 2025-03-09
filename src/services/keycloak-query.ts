import { AxiosError } from 'axios';
import { createAxiosInstance, fetchAuthQuery } from '../utils';
import { createApi } from '@reduxjs/toolkit/query/react';

const baseUrl = `${import.meta.env.VITE_KEYCLOAK_URL}/admin/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`;
const instance = createAxiosInstance({
	url: baseUrl,
	timeout: 300000,
});
export const keycloakApi = createApi({
	reducerPath: 'keycloakApi',
	baseQuery: fetchAuthQuery({
		baseUrl: baseUrl,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingUsers', 'User'],
	endpoints: (builder) => ({
		getAllUsers: builder.query<PagingWrapper<UserMetadata>, UserQuery>({
			queryFn: async ({
				email,
				firstName,
				lastName,
				exact = false,
				pageNumber,
				pageSize,
			}) => {
				try {
					const pagination = { offset: pageNumber ?? 0, max: pageSize ?? 5 };
					const params = {
						briefRepresentation: true,
						email: email,
						firstName: firstName,
						lastName: lastName,
						exact: exact,
						...pagination,
						enabled: true,
					};

					const totalElements = instance.get(`${baseUrl}/users/count`, {
						params,
					});
					const users: Array<UserRepresentation> = (
						await instance.get(`${baseUrl}/users`, {
							params,
						})
					).data;

					const filteredUsers = users.filter((user) => user.email);
					const deltaLength = users.length - filteredUsers.length;

					return {
						data: {
							content: filteredUsers,
							number: pagination.offset,
							size: pagination.max,
							numberOfElements: filteredUsers.length,
							totalElements: (await totalElements).data - deltaLength,
						},
					};
				} catch (error) {
					console.error(error);
					return {
						error: {
							status: (error as AxiosError).response?.status ?? 400,
							data: {
								message: (error as AxiosError).message,
							},
						},
					};
				}
			},
			providesTags(result, _err, arg) {
				const { email, exact } = arg;
				return result
					? [
							{
								type: 'PagingUsers',
								id: `${email}-${exact}-${result.number}-${result.size}-${result.numberOfElements}-${result.totalPages}-${result.totalElements}`,
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
export const { useGetByIdQuery, useGetAllUsersQuery } = keycloakApi;
