// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const productApi = createApi({
	reducerPath: 'products',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/product/`,
	}),
	endpoints: (builder) => ({
		getAllProductsByUserId: builder.query<Array<Product>, string>({
			query: (userId) => `${userId}/user`,
			transformResponse: (rawResult: Array<ProductResponse>) => {
				return rawResult.map((response) => {
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
