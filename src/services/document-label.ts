// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/label-mapper';

// Define a service using a base URL and expected endpoints
export const documentLabelApi = createApi({
	reducerPath: 'documentLabelApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/product/document/label`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingDocumentLabels', 'DocumentLabel'],
	endpoints: (builder) => ({
		getAllDocumentLabelsByUserId: builder.query<
			PagingWrapper<DocumentLabel>,
			{
				userId: string;
				labelName: string;
				pageNumber: number;
				pageSize: number;
			}
		>({
			query: ({ userId, labelName, pageNumber, pageSize }) => ({
				url: `${userId}/user`,
				method: 'GET',
				params: {
					labelName,
					pageNumber,
					pageSize,
				},
			}),
			providesTags(result, _error, arg) {
				return [
					{
						type: 'PagingDocumentLabels',
						id: `${arg.labelName}-${arg.pageNumber}-${arg.pageSize}-${result?.numberOfElements}-${result?.totalPages}-${result?.totalElements}`,
					},
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<DocumentLabelResponse>) {
				const content = rawResult.content.map((response) => {
					const label: DocumentLabel = {
						id: response.id,
						name: response.name,
						description: response.description,
						createdAt: new Date(response.createdAtMillis).toLocaleString(),
						updatedAt: response.updatedAtMillis
							? new Date(response.updatedAtMillis).toLocaleString()
							: '',
						color: response.color,
					};
					return label;
				});
				return {
					...rawResult,
					content,
				};
			},
		}),
		getLabelById: builder.query<DocumentLabel, string>({
			query: (labelId: string) => ({
				url: `/${labelId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return [
					{
						type: 'DocumentLabel',
						id: result?.id,
					} as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: DocumentLabelResponse) {
				return toEntity(rawResult);
			},
		}),

		postDocumentLabel: builder.mutation<
			DocumentLabel,
			DocumentLabelCreatingRequest
		>({
			query: (data: DocumentLabelCreatingRequest) => ({
				url: '',
				method: 'POST',
				body: data,
			}),
			invalidatesTags() {
				return [{ type: 'PagingDocumentLabels' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: DocumentLabelResponse) {
				const label: DocumentLabel = {
					id: rawResult.id,
					name: rawResult.name,
					description: rawResult.description,
					createdAt: new Date(rawResult.createdAtMillis).toLocaleString(),
					updatedAt: rawResult.updatedAtMillis
						? new Date(rawResult.updatedAtMillis).toLocaleString()
						: '',
					color: rawResult.color,
				};
				return label;
			},
		}),
		putLabel: builder.mutation<
			void,
			{ labelId: string; data: DocumentLabelUpdatingRequest }
		>({
			query: ({ labelId, data }) => ({
				url: `/${labelId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags(_result, _error, arg) {
				const { labelId } = arg;
				return [
					{ type: 'PagingDocumentLabels' } as const,
					{ type: 'DocumentLabel', id: labelId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteLabel: builder.mutation<void, string>({
			query: (labelId: string) => ({
				url: `/${labelId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const labelId = arg;
				return [
					{ type: 'PagingDocumentLabels' } as const,
					{ type: 'DocumentLabel', id: labelId } as const,
				];
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllDocumentLabelsByUserIdQuery,
	usePostDocumentLabelMutation,
	usePutLabelMutation,
	useDeleteLabelMutation,
	useGetLabelByIdQuery,
} = documentLabelApi;
