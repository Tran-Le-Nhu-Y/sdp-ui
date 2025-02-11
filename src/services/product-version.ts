// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const productVersionApi = createApi({
	reducerPath: 'productVersionApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/product/version`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingProductVersions'],
	endpoints: (builder) => ({
		getAllVersionsByProductId: builder.query<
			PagingWrapper<ProductVersion>,
			{
				productId: string;
				versionName: string;
				status: boolean;
				pageNumber: number;
				pageSize: number;
			}
		>({
			query: ({ productId, versionName, status, pageNumber, pageSize }) => ({
				url: `/${productId}/product`,
				method: 'GET',
				params: {
					versionName,
					isUsed: status,
					pageNumber,
					pageSize,
				},
			}),
			providesTags(result) {
				return [
					{
						type: 'PagingProductVersions',
						id: `${result?.number}-${result?.totalPages}-${result?.numberOfElements}-${result?.size}-${result?.totalElements}`,
					},
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(
				rawResult: PagingWrapper<ProductVersionResponse>,
				_meta,
				arg,
			) {
				const content = rawResult.content.map((response) => {
					const version: ProductVersion = {
						id: response.id,
						productId: arg.productId,
						name: response.versionName,
						createdAt: new Date(response.createdAtMillis).toLocaleString(),
						updatedAt: response.updatedAtMillis
							? new Date(response.updatedAtMillis).toLocaleString()
							: '',
						status: response.isUsed ? 'ACTIVE' : 'INACTIVE',
					};
					return version;
				});
				return {
					...rawResult,
					content,
				};
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllVersionsByProductIdQuery } = productVersionApi;
