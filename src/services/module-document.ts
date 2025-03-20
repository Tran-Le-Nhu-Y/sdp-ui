// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/module-document-mapper';
import { toEntity as toFileMetadata } from './mapper/file-mapper';
import { axiosBaseQuery, axiosQueryHandler } from '../utils';
import { sdpInstance } from './instance';
import { getMetadata as getFileMetadata } from './api/file-api';

const EXTENSION_URL = 'v1/software/module/document';
// Define a service using a base URL and expected endpoints
export const moduleDocumentApi = createApi({
	reducerPath: 'moduleDocumentApi',
	baseQuery: axiosBaseQuery(sdpInstance),
	tagTypes: [
		'PagingModuleDocument',
		'ModuleDocument',
		'ModuleDocumentAttachment',
	],
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
				url: `/${EXTENSION_URL}/${moduleVersionId}/version`,
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
				url: `/${EXTENSION_URL}/${documentId}`,
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
				url: `/${EXTENSION_URL}/${data.moduleVersionId}`,
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
				url: `/${EXTENSION_URL}/${data.moduleDocumentId}`,
				method: 'PUT',
				body: {
					name: data.name,
					description: data.description,
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
				url: `/${EXTENSION_URL}/${moduleDocumentId}`,
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
		getAllAttachments: builder.query<FileMetadata[], string>({
			queryFn: async (documentId) => {
				const func = async () => {
					const atmIds: string[] = (
						await sdpInstance.get(`/${EXTENSION_URL}/${documentId}/attachment`)
					).data;
					const atmMetadataResponses: FileMetadataResponse[] =
						await Promise.all(atmIds.map(getFileMetadata));
					return atmMetadataResponses.map(toFileMetadata);
				};

				return axiosQueryHandler(func);
			},
			providesTags(_result, _error, arg) {
				const documentId = arg;
				return [
					{
						type: 'ModuleDocumentAttachment',
						id: documentId,
					} as const,
				];
			},
		}),
		putAttachment: builder.mutation<
			void,
			ModuleDocumentAttachmentUpdateRequest
		>({
			query: ({ documentId, attachmentId, operator }) => ({
				url: `/${EXTENSION_URL}/${documentId}/attachment`,
				method: 'PUT',
				body: {
					attachmentId: attachmentId,
					operator: operator,
				},
			}),
			invalidatesTags() {
				return [{ type: 'ModuleDocumentAttachment' } as const];
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
	useGetAllAttachmentsQuery,
	usePutAttachmentMutation,
} = moduleDocumentApi;
