import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/software-mapper';
import { fetchAuthQuery } from '../utils';

export const softwareApi = createApi({
	reducerPath: 'softwareApi',
	baseQuery: fetchAuthQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/software`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingSoftware', 'Software'],
	endpoints: (builder) => ({
		getAllSoftwareByUserId: builder.query<
			PagingWrapper<Software>,
			GetAllSoftwareQuery
		>({
			query: ({ userId, softwareName, pageNumber, pageSize }) => ({
				url: `/${userId}/user`,
				method: 'GET',
				params: {
					name: softwareName,
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),
			providesTags(result) {
				const pagingTag = {
					type: 'PagingSoftware',
					id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
				} as const;

				return result
					? [
							...result.content.map(
								({ id }) => ({ type: 'Software', id }) as const
							),
							pagingTag,
						]
					: [pagingTag];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<SoftwareResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getSoftwareById: builder.query<Software, string>({
			query: (softwareId: string) => ({
				url: `/${softwareId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'Software',
								id: result.id,
							} as const,
						]
					: [];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: SoftwareResponse) {
				return toEntity(rawResult);
			},
		}),
		postSoftware: builder.mutation<Software, SoftwareCreateRequest>({
			query: (data: SoftwareCreateRequest) => ({
				url: `/${data.userId}`,
				method: 'POST',
				body: {
					name: data.name,
					description: data.description,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingSoftware' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: SoftwareResponse) {
				return toEntity(rawResult);
			},
		}),
		putSoftware: builder.mutation<void, SoftwareUpdateRequest>({
			query: (data: SoftwareUpdateRequest) => ({
				url: `/${data.softwareId}`,
				method: 'PUT',
				body: {
					name: data.name,
					description: data.description,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { softwareId } = arg;
				return [
					{ type: 'PagingSoftware' } as const,
					{ type: 'Software', id: softwareId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteSoftware: builder.mutation<void, string>({
			query: (softwareId: string) => ({
				url: `/${softwareId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const productId = arg;
				return [
					{ type: 'PagingSoftware' } as const,
					{ type: 'Software', id: productId } as const,
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
	useGetAllSoftwareByUserIdQuery,
	useDeleteSoftwareMutation,
	useGetSoftwareByIdQuery,
	usePostSoftwareMutation,
	usePutSoftwareMutation,
} = softwareApi;
