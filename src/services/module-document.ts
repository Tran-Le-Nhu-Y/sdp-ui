// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/module-document-mapper';

// Define a service using a base URL and expected endpoints
export const moduleDocumentApi = createApi({
	reducerPath: 'moduleDocumentApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/software/module/document`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingModuleDocument', 'ModuleDocument'],
	endpoints: (builder) => ({
		getAllModuleDocumentsByVersionId: builder.query<
			PagingWrapper<ModuleDocument>,
			GetAllModuleDocumentQuery
		>({
			query: ({
				moduleVersionId,
				documentTypeName,
				moduleDocumentName,
				pageNumber,
				pageSize,
			}) => ({
				url: `/${moduleVersionId}/version`,
				method: 'GET',
				params: {
					documentTypeName: documentTypeName,
					documentName: moduleDocumentName,
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),
			providesTags(result, _error, arg) {
				return [
					{
						type: 'PagingModuleDocument',
						id: `${arg.documentTypeName}-${arg.moduleDocumentName}-${arg.pageNumber}-${arg.pageSize}-${result?.numberOfElements}-${result?.totalPages}-${result?.totalElements}`,
					},
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<ModuleDocumentResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getModuleDocumentById: builder.query<ModuleDocument, string>({
			query: (documentId: string) => ({
				url: `/${documentId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return [
					{
						type: 'ModuleDocument',
						id: result?.id,
					} as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: ModuleDocumentResponse) {
				return toEntity(rawResult);
			},
		}),

		postModuleDocument: builder.mutation<
			ModuleDocument,
			ModuleDocumentCreateRequest
		>({
			query: (data: ModuleDocumentCreateRequest) => ({
				url: `/${data.moduleVersionId}`,
				method: 'POST',
				body: {
					name: data.name,
					description: data.description,
					attachmentIds: data.attachmentIds,
					typeId: data.documentTypeId,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingModuleDocument' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: ModuleDocumentResponse) {
				return toEntity(rawResult);
			},
		}),
		putModuleDocument: builder.mutation<void, ModuleDocumentUpdateRequest>({
			query: (data: ModuleDocumentUpdateRequest) => ({
				url: `/${data.moduleDocumentId}`,
				method: 'PUT',
				body: {
					name: data.name,
					description: data.description,
					attachmentIds: data.attachmentIds,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { moduleDocumentId } = arg;
				return [
					{ type: 'PagingModuleDocument' } as const,
					{ type: 'ModuleDocument', id: moduleDocumentId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteModuleDocument: builder.mutation<void, string>({
			query: (moduleDocumentId: string) => ({
				url: `/${moduleDocumentId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const moduleDocumentId = arg;
				return [
					{ type: 'PagingModuleDocument' } as const,
					{ type: 'ModuleDocument', id: moduleDocumentId } as const,
				];
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllModuleDocumentsByVersionIdQuery,
	useGetModuleDocumentByIdQuery,
	usePostModuleDocumentMutation,
	usePutModuleDocumentMutation,
	useDeleteModuleDocumentMutation,
} = moduleDocumentApi;
