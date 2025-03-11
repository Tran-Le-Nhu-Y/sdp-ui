// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/software-document-mapper';
import { toEntity as toFileMetadata } from './mapper/file-mapper';
import { axiosBaseQuery, axiosQueryHandler } from '../utils';
import { sdpInstance } from './instance';
import { getMetadata as getFileMetadata } from './api/file-api';

const EXTENSION_URL = 'v1/software/document';
// Define a service using a base URL and expected endpoints
export const softwareDocumentApi = createApi({
	reducerPath: 'softwareDocumentApi',
	baseQuery: axiosBaseQuery(sdpInstance),
	tagTypes: [
		'PagingSoftwareDocument',
		'SoftwareDocument',
		'SoftwareDocumentAttachment',
	],
	endpoints: (builder) => ({
		getAllSoftwareDocumentsByVersionId: builder.query<
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
				url: `/${EXTENSION_URL}/${softwareVersionId}/version`,
				method: 'GET',
				params: {
					documentTypeName: documentTypeName,
					documentName: softwareDocumentName,
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
				url: `/${EXTENSION_URL}/${documentId}`,
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
				url: `/${EXTENSION_URL}/${data.softwareVersionId}`,
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
				url: `/${EXTENSION_URL}/${data.softwareDocumentId}`,
				method: 'PUT',
				body: {
					name: data.name,
					description: data.description,
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
				url: `/${EXTENSION_URL}/${softwareDocumentId}`,
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
		getAllAttachments: builder.query<FileMetadata[], string>({
			queryFn: async (documentId) => {
				const func = async () => {
					const atmIds: string[] = (
						await sdpInstance.get(`${EXTENSION_URL}/${documentId}/attachment`)
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
						type: 'SoftwareDocumentAttachment',
						id: documentId,
					} as const,
				];
			},
		}),
		putAttachment: builder.mutation<
			void,
			SoftwareDocumentAttachmentUpdateRequest
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
				return [{ type: 'SoftwareDocumentAttachment' } as const];
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllSoftwareDocumentsByVersionIdQuery,
	useGetSoftwareDocumentByIdQuery,
	usePostSoftwareDocumentMutation,
	usePutSoftwareDocumentMutation,
	useDeleteSoftwareDocumentMutation,
	useGetAllAttachmentsQuery,
	usePutAttachmentMutation,
} = softwareDocumentApi;
