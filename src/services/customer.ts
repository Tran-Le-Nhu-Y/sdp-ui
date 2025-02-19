import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/customer-mapper';

export const customerApi = createApi({
	reducerPath: 'customerApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/software/customer`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingCustomers', 'Customer'],
	endpoints: (builder) => ({
		getAllCustomers: builder.query<
			PagingWrapper<Customer>,
			GetAllCustomerQuery
		>({
			query: ({ email, name, pageNumber, pageSize }) => ({
				url: ``,
				method: 'GET',
				params: {
					email: email,
					name: name,
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),
			providesTags(result) {
				const pagingTag = {
					type: 'PagingCustomers',
					id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
				} as const;

				return result
					? [
							...result.content.map(
								({ id }) => ({ type: 'Customer', id }) as const
							),
							pagingTag,
						]
					: [pagingTag];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<CustomerResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getCustomerById: builder.query<Customer, string>({
			query: (customerId: string) => ({
				url: `/${customerId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'Customer',
								id: result.id,
							} as const,
						]
					: [];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: CustomerResponse) {
				return toEntity(rawResult);
			},
		}),
		postCustomer: builder.mutation<Customer, CustomerCreateRequest>({
			query: ({ name, email, userId }) => ({
				url: `/${userId}`,
				method: 'POST',
				body: {
					name: name,
					email: email,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingCustomers' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: CustomerResponse) {
				return toEntity(rawResult);
			},
		}),
		putCustomer: builder.mutation<void, CustomerUpdateRequest>({
			query: ({ name, email, customerId }) => ({
				url: `/${customerId}`,
				method: 'PUT',
				body: {
					name: name,
					email: email,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { customerId } = arg;
				return [
					{ type: 'PagingCustomers' } as const,
					{ type: 'Customer', id: customerId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteCustomer: builder.mutation<void, string>({
			query: (softwareId: string) => ({
				url: `/${softwareId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const productId = arg;
				return [
					{ type: 'PagingCustomers' } as const,
					{ type: 'Customer', id: productId } as const,
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
	useGetAllCustomersQuery,
	useGetCustomerByIdQuery,
	usePostCustomerMutation,
	usePutCustomerMutation,
	useDeleteCustomerMutation,
} = customerApi;
