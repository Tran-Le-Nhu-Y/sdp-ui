import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/file-mapper';
import { axiosBaseQuery } from '../utils';
import { fileInst } from './instance';

const EXTENSION_URL = 'v1/file';
export const fileApi = createApi({
	reducerPath: 'fileApi',
	baseQuery: axiosBaseQuery(fileInst),
	tagTypes: ['FileMetadata'],
	endpoints: (builder) => ({
		getMetadata: builder.query<FileMetadata, string>({
			query: (fileId) => ({
				url: `/${EXTENSION_URL}/${fileId}/metadata`,
				method: 'GET',
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'FileMetadata',
								id: result.id,
							} as const,
						]
					: [];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: FileMetadataResponse) {
				return toEntity(rawResult);
			},
		}),
		get: builder.query<File, string>({
			query: (fileId) => ({
				url: `/${EXTENSION_URL}/${fileId}`,
				method: 'GET',
			}),
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		post: builder.mutation<string, FileCreateRequest>({
			query: ({ userId, file }) => {
				const body = new FormData();
				body.append('file', file, file.name);

				return {
					url: `/${EXTENSION_URL}/${userId}`,
					method: 'POST',
					body,
				};
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		delete: builder.mutation<void, string>({
			query: (fileId) => ({
				url: `/${EXTENSION_URL}/${fileId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const fileId = arg;
				return [{ type: 'FileMetadata', id: fileId } as const];
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
	useGetMetadataQuery,
	useGetQuery,
	usePostMutation,
	useDeleteMutation,
} = fileApi;
