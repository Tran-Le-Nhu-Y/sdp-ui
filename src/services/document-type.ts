// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/document-type-mapper';
import { axiosBaseQuery } from '../utils';
import { sdpInstance } from './instance';

const EXTENSION_URL = 'v1/software/document-type';
// Define a service using a base URL and expected endpoints
export const documentTypeApi = createApi({
	reducerPath: 'documentTypeApi',
	baseQuery: axiosBaseQuery(sdpInstance),
	tagTypes: ['PagingSoftwareDocument', 'SoftwareDocument'],
	endpoints: (builder) => ({
		getAllDocumentTypesByUserId: builder.query<
			PagingWrapper<SdpDocumentType>,
			GetAllDocumentTypeQuery
		>({
			query: ({ userId, documentTypeName, pageNumber, pageSize }) => ({
				url: `/${EXTENSION_URL}/${userId}/user`,
				method: 'GET',
				params: {
					documentTypeName: documentTypeName,
					pageNumber: pageNumber,
					pageSize: pageSize,
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
				url: `/${EXTENSION_URL}/${typeId}`,
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
			DocumentTypeCreateRequest
		>({
			query: (data: DocumentTypeCreateRequest) => ({
				url: `/${EXTENSION_URL}/${data.userId}`,
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
		putDocumentType: builder.mutation<void, DocumentTypeUpdateRequest>({
			query: (data: DocumentTypeUpdateRequest) => ({
				url: `/${EXTENSION_URL}/${data.typeId}`,
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
				url: `/${EXTENSION_URL}/${typeId}`,
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
