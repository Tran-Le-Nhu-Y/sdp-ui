// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/software-document-mapper';
import { toEntity as toFileMetadata } from './mapper/file-mapper';
import { fetchAuthQuery } from '../utils';

const baseUrl = `${import.meta.env.VITE_API_GATEWAY}/software/document`;
// Define a service using a base URL and expected endpoints
export const softwareDocumentApi = createApi({
	reducerPath: 'softwareDocumentApi',
	baseQuery: fetchAuthQuery({
		baseUrl: baseUrl,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
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
				url: `/${softwareVersionId}/version`,
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
		getAllAttachments: builder.query<FileMetadata[], string>({
			queryFn: async (documentId) => {
				try {
					const atmIdsResponse = await fetch(
						`${baseUrl}/${documentId}/attachment`,
						{
							method: 'GET',
						}
					);
					const atmIds: string[] = await atmIdsResponse.json();
					const atmMetadataResponses: FileMetadataResponse[] =
						await Promise.all(
							atmIds.map(async (atmId) => {
								const response = await fetch(
									`${import.meta.env.VITE_FILE_API}/v1/file/${atmId}/metadata`,
									{
										method: 'GET',
									}
								);
								return response.json();
							})
						);
					return {
						data: atmMetadataResponses.map(toFileMetadata),
					};
				} catch (error) {
					console.error(error);
					return {
						error: {
							status: 500,
							data: {
								message: 'Error when fetching software document attachments',
							},
						},
					};
				}
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
				url: `/${documentId}/attachment`,
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
