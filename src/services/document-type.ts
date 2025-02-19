// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/document-type-mapper';

// Define a service using a base URL and expected endpoints
export const documentTypeApi = createApi({
	reducerPath: 'documentTypeApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/software/document-type`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingSoftwareDocument', 'SoftwareDocument'],
	endpoints: (builder) => ({
		getAllDocumentTypesByUserId: builder.query<
			PagingWrapper<SdpDocumentType>,
			GetAllDocumentTypeQuery
		>({
			query: ({
				userId,
				documentTypeName: typeName,
				pageNumber,
				pageSize,
			}) => ({
				url: `${userId}/user`,
				method: 'GET',
				params: {
					typeName,
					pageNumber,
					pageSize,
				},
			}),
			providesTags(result, _error, arg) {
				return [
					{
						type: 'PagingSoftwareDocument',
						id: `${arg.documentTypeName}-${arg.pageNumber}-${arg.pageSize}-${result?.numberOfElements}-${result?.totalPages}-${result?.totalElements}`,
					},
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<DocumentTypeResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getDocumentTypeById: builder.query<SdpDocumentType, string>({
			query: (typeId: string) => ({
				url: `/${typeId}`,
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
			transformResponse(rawResult: DocumentTypeResponse) {
				return toEntity(rawResult);
			},
		}),

		postDocumentType: builder.mutation<
			SdpDocumentType,
			DocumentTypeCreatingRequest
		>({
			query: (data: DocumentTypeCreatingRequest) => ({
				url: `/${data.userId}`,
				method: 'POST',
				body: {
					name: data.name,
					description: data.description,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingSoftwareDocument' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: DocumentTypeResponse) {
				return toEntity(rawResult);
			},
		}),
		putDocumentType: builder.mutation<void, DocumentTypeUpdatingRequest>({
			query: (data: DocumentTypeUpdatingRequest) => ({
				url: `/${data.typeId}`,
				method: 'PUT',
				body: {
					name: data.name,
					description: data.description,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { typeId } = arg;
				return [
					{ type: 'PagingSoftwareDocument' } as const,
					{ type: 'SoftwareDocument', id: typeId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteDocumentType: builder.mutation<void, string>({
			query: (typeId: string) => ({
				url: `/${typeId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const typeId = arg;
				return [
					{ type: 'PagingSoftwareDocument' } as const,
					{ type: 'SoftwareDocument', id: typeId } as const,
				];
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllDocumentTypesByUserIdQuery,
	useGetDocumentTypeByIdQuery,
	usePostDocumentTypeMutation,
	usePutDocumentTypeMutation,
	useDeleteDocumentTypeMutation,
} = documentTypeApi;
