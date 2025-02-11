import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/product-mapper';

export const productApi = createApi({
	reducerPath: 'productApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/product`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingProducts', 'Product'],
	endpoints: (builder) => ({
		getAllProductsByUserId: builder.query<
			PagingWrapper<Product>,
			{ userId: string; pageNumber: number; pageSize: number }
		>({
			query: ({ userId, pageNumber, pageSize }) => ({
				url: `/${userId}/user`,
				method: 'GET',
				params: {
					pageNumber,
					pageSize,
				},
			}),
			providesTags(result) {
				return [
					{
						type: 'PagingProducts',
						id: `${result?.number}-${result?.totalPages}-${result?.numberOfElements}-${result?.size}-${result?.totalElements}`,
					} as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<ProductResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getProductById: builder.query<Product, string>({
			query: (productId: string) => ({
				url: `/${productId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return [
					{
						type: 'Product',
						id: result?.id,
					} as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: ProductResponse) {
				return toEntity(rawResult);
			},
		}),
		postProduct: builder.mutation<Product, ProductCreatingRequest>({
			query: (data: ProductCreatingRequest) => ({
				url: '',
				method: 'POST',
				body: data,
			}),
			invalidatesTags() {
				return [{ type: 'PagingProducts' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: ProductResponse) {
				return toEntity(rawResult);
			},
		}),
		putProduct: builder.mutation<
			void,
			{ productId: string; data: ProductUpdatingRequest }
		>({
			query: ({ productId, data }) => ({
				url: `/${productId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags(_result, _error, arg) {
				const { productId } = arg;
				return [
					{ type: 'PagingProducts' } as const,
					{ type: 'Product', id: productId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteProduct: builder.mutation<void, string>({
			query: (productId: string) => ({
				url: `/${productId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const productId = arg;
				return [
					{ type: 'PagingProducts' } as const,
					{ type: 'Product', id: productId } as const,
				];
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
	useGetAllProductsByUserIdQuery,
	useGetProductByIdQuery,
	usePostProductMutation,
	usePutProductMutation,
	useDeleteProductMutation,
} = productApi;
