// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/software-version-mapper';
import { fetchAuthQuery } from '../utils';

// Define a service using a base URL and expected endpoints
export const softwareVersionApi = createApi({
	reducerPath: 'softwareVersionApi',
	baseQuery: fetchAuthQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/software/version`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingSoftwareVersions', 'SoftwareVersion'],
	endpoints: (builder) => ({
		getAllVersionsBySoftwareId: builder.query<
			PagingWrapper<SoftwareVersion>,
			GetAllSoftwareVersionQuery
		>({
			query: ({ softwareId, versionName, pageNumber, pageSize }) => ({
				url: `/${softwareId}/software`,
				method: 'GET',
				params: {
					name: versionName,
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),
			providesTags(result) {
				const pagingTag = {
					type: 'PagingSoftwareVersions',
					id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
				} as const;

				return result
					? [
							...result.content.map(
								({ id }) => ({ type: 'SoftwareVersion', id }) as const
							),
							pagingTag,
						]
					: [pagingTag];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<SoftwareVersionResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getAllVersionsByUserId: builder.query<
			PagingWrapper<SoftwareAndVersion>,
			GetAllSoftwareVersionByUserQuery
		>({
			query: ({ userId, softwareName, versionName, pageNumber, pageSize }) => ({
				url: `/${userId}/user`,
				method: 'GET',
				params: {
					softwareName: softwareName,
					versionName: versionName,
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),
			providesTags(result) {
				return [
					{
						type: 'PagingSoftwareVersions',
						id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
					} as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		getSoftwareVersionById: builder.query<SoftwareVersion, string>({
			query: (versionId: string) => ({
				url: `/${versionId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'SoftwareVersion',
								id: result?.id,
							} as const,
						]
					: [];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: SoftwareVersionResponse) {
				return toEntity(rawResult);
			},
		}),
		postSoftwareVersion: builder.mutation<
			SoftwareVersion,
			SoftwareVersionCreateRequest
		>({
			query: (data: SoftwareVersionCreateRequest) => ({
				url: `/${data.softwareId}`,
				method: 'POST',
				body: {
					name: data.name,
					description: data.description,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingSoftwareVersions' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: SoftwareResponse) {
				return toEntity(rawResult);
			},
		}),
		putSoftwareVersion: builder.mutation<void, SoftwareVersionUpdateRequest>({
			query: (data: SoftwareVersionUpdateRequest) => ({
				url: `/${data.versionId}`,
				method: 'PUT',
				body: {
					name: data.name,
					description: data.description,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { versionId } = arg;
				return [
					{ type: 'PagingSoftwareVersions' } as const,
					{ type: 'SoftwareVersion', id: versionId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteSoftwareVersion: builder.mutation<void, string>({
			query: (versionId: string) => ({
				url: `/${versionId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const versionId = arg;
				return [
					{ type: 'PagingSoftwareVersions' } as const,
					{ type: 'SoftwareVersion', id: versionId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllVersionsBySoftwareIdQuery,
	useGetAllVersionsByUserIdQuery,
	useGetSoftwareVersionByIdQuery,
	usePostSoftwareVersionMutation,
	usePutSoftwareVersionMutation,
	useDeleteSoftwareVersionMutation,
} = softwareVersionApi;
