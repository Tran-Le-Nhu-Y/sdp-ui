// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const documentLabelApi = createApi({
	reducerPath: 'documentLabelApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/product/document/label`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingDocumentLabels'],
	endpoints: (builder) => ({
		getAllDocumentLabelsByUserId: builder.query<
			PagingWrapper<DocumentLabel>,
			{
				userId: string;
				pageNumber: number;
				pageSize: number;
			}
		>({
			query: ({ userId, pageNumber, pageSize }) => ({
				url: `${userId}/user`,
				method: 'GET',
				params: {
					pageNumber,
					pageSize,
				},
			}),
			providesTags(result) {
				return [
					{
						type: 'PagingDocumentLabels',
						id: `${result?.number}-${result?.totalPages}-${result?.numberOfElements}-${result?.size}-${result?.totalElements}`,
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
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllDocumentLabelsByUserIdQuery,
	usePostDocumentLabelMutation,
} = documentLabelApi;
