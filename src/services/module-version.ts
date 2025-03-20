// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/module-version-mapper';
import { axiosBaseQuery } from '../utils';
import { sdpInstance } from './instance';

const EXTENSION_URL = 'v1/software/module/version';
// Define a service using a base URL and expected endpoints
export const moduleVersionApi = createApi({
	reducerPath: 'moduleVersionApi',
	baseQuery: axiosBaseQuery(sdpInstance),
	tagTypes: ['PagingModuleVersion', 'ModuleVersion'],
	endpoints: (builder) => ({
		getAllModuleVersionsByModuleId: builder.query<
			PagingWrapper<ModuleVersion>,
			GetAllModuleVersionQuery
		>({
			query: ({ moduleId, moduleVersionName, pageNumber, pageSize }) => ({
				url: `/${EXTENSION_URL}/${moduleId}/module`,
				method: 'GET',
				params: {
					moduleName: moduleVersionName,
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),
			providesTags(result) {
				const pagingTag = {
					type: 'PagingModuleVersion',
					id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
				} as const;

				return result
					? [
							...result.content.map(
								({ id }) => ({ type: 'ModuleVersion', id }) as const
							),
							pagingTag,
						]
					: [pagingTag];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<ModuleVersionResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getAllVersionsBySoftwareVersionId: builder.query<
			PagingWrapper<ModuleAndVersion>,
			GetAllModuleVersionBySoftwareVersionQuery
		>({
			query: ({
				softwareVersionId,
				moduleName,
				versionName,
				pageNumber,
				pageSize,
			}) => ({
				url: `/${EXTENSION_URL}/${softwareVersionId}/software-version`,
				method: 'GET',
				params: {
					moduleName: moduleName,
					versionName: versionName,
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),
			providesTags(result) {
				return [
					{
						type: 'PagingModuleVersion',
						id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
					} as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		getModuleVersionById: builder.query<ModuleVersion, string>({
			query: (moduleVersionId: string) => ({
				url: `/${EXTENSION_URL}/${moduleVersionId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'ModuleVersion',
								id: result?.id,
							} as const,
						]
					: [];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: ModuleVersionResponse) {
				return toEntity(rawResult);
			},
		}),
		postModuleVersion: builder.mutation<
			ModuleVersion,
			ModuleVersionCreateRequest
		>({
			query: (data: ModuleVersionCreateRequest) => ({
				url: `/${EXTENSION_URL}/${data.moduleId}`,
				method: 'POST',
				body: {
					name: data.name,
					description: data.description,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingModuleVersion' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: ModuleVersionResponse) {
				return toEntity(rawResult);
			},
		}),
		putModuleVersion: builder.mutation<void, ModuleVersionUpdateRequest>({
			query: (data: ModuleVersionUpdateRequest) => ({
				url: `/${EXTENSION_URL}/${data.moduleVersionId}`,
				method: 'PUT',
				body: {
					name: data.name,
					description: data.description,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { moduleVersionId } = arg;
				return [
					{ type: 'PagingModuleVersion' } as const,
					{ type: 'ModuleVersion', id: moduleVersionId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteModuleVersion: builder.mutation<void, string>({
			query: (moduleVersionId: string) => ({
				url: `/${EXTENSION_URL}/${moduleVersionId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const moduleVersionId = arg;
				return [
					{ type: 'PagingModuleVersion' } as const,
					{ type: 'ModuleVersion', id: moduleVersionId } as const,
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
	useGetAllModuleVersionsByModuleIdQuery,
	useGetAllVersionsBySoftwareVersionIdQuery,
	useGetModuleVersionByIdQuery,
	usePostModuleVersionMutation,
	usePutModuleVersionMutation,
	useDeleteModuleVersionMutation,
} = moduleVersionApi;
