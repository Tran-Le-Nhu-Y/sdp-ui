import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/module-mapper';
import { fetchAuthQuery } from '../utils';

export const moduleApi = createApi({
	reducerPath: 'moduleApi',
	baseQuery: fetchAuthQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/software/module`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingModule', 'Module'],
	endpoints: (builder) => ({
		getAllModuleBySoftwareVersionId: builder.query<
			PagingWrapper<Module>,
			GetAllModuleQuery
		>({
			query: ({ softwareVersionId, moduleName, pageNumber, pageSize }) => ({
				url: `/${softwareVersionId}/software-version`,
				method: 'GET',
				params: {
					moduleName: moduleName,
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),
			providesTags(result) {
				const pagingTag = {
					type: 'PagingModule',
					id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
				} as const;

				return result
					? [
							...result.content.map(
								({ id }) => ({ type: 'Module', id }) as const
							),
							pagingTag,
						]
					: [pagingTag];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<ModuleResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getModuleById: builder.query<Module, string>({
			query: (moduleId: string) => ({
				url: `/${moduleId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'Module',
								id: result.id,
							} as const,
						]
					: [];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: ModuleResponse) {
				return toEntity(rawResult);
			},
		}),
		postModule: builder.mutation<Module, ModuleCreateRequest>({
			query: (data: ModuleCreateRequest) => ({
				url: `/${data.softwareVersionId}`,
				method: 'POST',
				body: {
					name: data.name,
					description: data.description,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingModule' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: ModuleResponse) {
				return toEntity(rawResult);
			},
		}),
		putModule: builder.mutation<void, ModuleUpdateRequest>({
			query: (data: ModuleUpdateRequest) => ({
				url: `/${data.moduleId}`,
				method: 'PUT',
				body: {
					name: data.name,
					description: data.description,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { moduleId } = arg;
				return [
					{ type: 'PagingModule' } as const,
					{ type: 'Module', id: moduleId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteModule: builder.mutation<void, string>({
			query: (moduleId: string) => ({
				url: `/${moduleId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const moduleId = arg;
				return [
					{ type: 'PagingModule' } as const,
					{ type: 'Module', id: moduleId } as const,
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
	useGetAllModuleBySoftwareVersionIdQuery,
	useGetModuleByIdQuery,
	usePostModuleMutation,
	usePutModuleMutation,
	useDeleteModuleMutation,
} = moduleApi;
