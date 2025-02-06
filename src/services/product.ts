// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const productApi = createApi({
	reducerPath: 'products',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/product/`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['Product'],
	endpoints: (builder) => ({
		getAllProductsByUserId: builder.query<
			Array<Product>,
			{ userId: string; pageNumber: number; pageSize: number }
		>({
			query: ({ userId, pageNumber, pageSize }) => ({
				url: `${userId}/user`,
				method: 'GET',
				params: {
					pageNumber,
					pageSize,
				},
			}),
			// Always merge incoming data to the cache entry
			merge: (currentCache, newItems) => {
				currentCache.push(...newItems);
			},
			// Refetch when the page arg changes
			forceRefetch({ currentArg, previousArg }) {
				return currentArg !== previousArg;
			},
			providesTags(result) {
				return result
					? [
							...result.map(({ id }) => ({ type: 'Product' as const, id })),
							{ type: 'Product', id: 'LIST' },
						]
					: [{ type: 'Product', id: 'LIST' }];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<ProductResponse>) {
				return rawResult.content.map((response) => {
					const product: Product = {
						id: response.id,
						name: response.name,
						description: response.description,
						dateCreated: new Date(response.createdAtMillis),
						lastUpdated: new Date(response.updatedAtMillis),
						status: response.isUsed ? 'ACTIVE' : 'INACTIVE',
					};
					return product;
				});
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllProductsByUserIdQuery } = productApi;
