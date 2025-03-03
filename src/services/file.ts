import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/file-mapper';

export const fileApi = createApi({
	reducerPath: 'fileApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_FILE_API}/v1/file`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['FileMetadata'],
	endpoints: (builder) => ({
		getMetadata: builder.query<FileMetadata, string>({
			query: (fileId) => ({
				url: `/${fileId}/metadata`,
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
				url: `/${fileId}`,
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
					url: `/${userId}`,
					method: 'POST',
					body: body,
					priority: 'high',
					responseHandler: (response) => response.text(),
				};
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		delete: builder.mutation<void, string>({
			query: (fileId) => ({
				url: `/${fileId}`,
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
