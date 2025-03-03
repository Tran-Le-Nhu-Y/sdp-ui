// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/module-document-mapper';
import { toEntity as toFileMetadata } from './mapper/file-mapper';

const baseUrl = `${import.meta.env.VITE_API_GATEWAY}/software/module/document`;
// Define a service using a base URL and expected endpoints
export const moduleDocumentApi = createApi({
	reducerPath: 'moduleDocumentApi',
	baseQuery: fetchBaseQuery({
		baseUrl: baseUrl,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
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
				url: `/${documentId}/attachment`,
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
