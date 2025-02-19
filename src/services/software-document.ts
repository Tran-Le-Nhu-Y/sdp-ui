// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/software-document-mapper';

// Define a service using a base URL and expected endpoints
export const softwareDocumentApi = createApi({
	reducerPath: 'softwareDocumentApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/software/document`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingSoftwareDocument', 'SoftwareDocument'],
	endpoints: (builder) => ({
		getAllSoftwareDocumentsByUserId: builder.query<
			PagingWrapper<SoftwareDocument>,
			GetAllSoftwareDocumentQuery
		>({
			query: ({
				softwareVersionId,
				documentTypeName,
				softwareDocumentName,
				pageNumber,
				pageSize,
			}) => ({
				url: `/${softwareVersionId}/version`,
				method: 'GET',
				params: {
					documentTypeName: documentTypeName,
					softwareDocumentName: softwareDocumentName,
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),
			providesTags(result, _error, arg) {
				return [
					{
						type: 'PagingSoftwareDocument',
						id: `${arg.documentTypeName}-${arg.softwareDocumentName}-${arg.pageNumber}-${arg.pageSize}-${result?.numberOfElements}-${result?.totalPages}-${result?.totalElements}`,
					},
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<SoftwareDocumentResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getSoftwareDocumentById: builder.query<SoftwareDocument, string>({
			query: (documentId: string) => ({
				url: `/${documentId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return [
					{
						type: 'SoftwareDocument',
						id: result?.id,
					} as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: SoftwareDocumentResponse) {
				return toEntity(rawResult);
			},
		}),

		postSoftwareDocument: builder.mutation<
			SoftwareDocument,
			SoftwareDocumentCreateRequest
		>({
			query: (data: SoftwareDocumentCreateRequest) => ({
				url: `/${data.softwareVersionId}`,
				method: 'POST',
				body: {
					name: data.name,
					description: data.description,
					attachmentIds: data.attachmentIds,
					typeId: data.documentTypeId,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingSoftwareDocument' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: SoftwareDocumentResponse) {
				return toEntity(rawResult);
			},
		}),
		putSoftwareDocument: builder.mutation<void, SoftwareDocumentUpdateRequest>({
			query: (data: SoftwareDocumentUpdateRequest) => ({
				url: `/${data.softwareDocumentId}`,
				method: 'PUT',
				body: {
					name: data.name,
					description: data.description,
					attachmentIds: data.attachmentIds,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { softwareDocumentId } = arg;
				return [
					{ type: 'PagingSoftwareDocument' } as const,
					{ type: 'SoftwareDocument', id: softwareDocumentId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteSoftwareDocument: builder.mutation<void, string>({
			query: (softwareDocumentId: string) => ({
				url: `/${softwareDocumentId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const softwareDocumentId = arg;
				return [
					{ type: 'PagingSoftwareDocument' } as const,
					{ type: 'SoftwareDocument', id: softwareDocumentId } as const,
				];
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllSoftwareDocumentsByUserIdQuery,
	useGetSoftwareDocumentByIdQuery,
	usePostSoftwareDocumentMutation,
	usePutSoftwareDocumentMutation,
	useDeleteSoftwareDocumentMutation,
} = softwareDocumentApi;
