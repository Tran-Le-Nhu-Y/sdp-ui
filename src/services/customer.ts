// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/customer-mapper';

// Define a service using a base URL and expected endpoints
export const customerApi = createApi({
	reducerPath: 'customerApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/software/customer`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingCustomer', 'Customer'],
	endpoints: (builder) => ({
		getAllCustomer: builder.query<PagingWrapper<Customer>, GetAllCustomerQuery>(
			{
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
				providesTags(result, _error, arg) {
					return [
						{
							type: 'PagingCustomer',
							id: `${arg.email}-${arg.name}-${arg.pageNumber}-${arg.pageSize}-${result?.numberOfElements}-${result?.totalPages}-${result?.totalElements}`,
						},
					];
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
			},
		),
		getCustomerById: builder.query<Customer, string>({
			query: (customerId: string) => ({
				url: `/${customerId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return [
					{
						type: 'Customer',
						id: result?.id,
					} as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: CustomerResponse) {
				return toEntity(rawResult);
			},
		}),

		postCustomer: builder.mutation<Customer, CustomerCreateRequest>({
			query: (data: CustomerCreateRequest) => ({
				url: `/${data.userId}`,
				method: 'POST',
				body: {
					name: data.name,
					email: data.email,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingCustomer' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: CustomerResponse) {
				return toEntity(rawResult);
			},
		}),
		putCustomer: builder.mutation<void, CustomerUpdateRequest>({
			query: (data: CustomerUpdateRequest) => ({
				url: `/${data.customerId}`,
				method: 'PUT',
				body: {
					name: data.name,
					email: data.email,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { customerId } = arg;
				return [
					{ type: 'PagingCustomer' } as const,
					{ type: 'Customer', id: customerId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteCustomer: builder.mutation<void, string>({
			query: (customerId: string) => ({
				url: `/${customerId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const customerId = arg;
				return [
					{ type: 'PagingCustomer' } as const,
					{ type: 'Customer', id: customerId } as const,
				];
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllCustomerQuery,
	useGetCustomerByIdQuery,
	usePostCustomerMutation,
	usePutCustomerMutation,
	useDeleteCustomerMutation,
} = customerApi;
