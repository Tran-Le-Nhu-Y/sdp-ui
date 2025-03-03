import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/deployment-phase-type';
import { fetchAuthQuery } from '../utils';

export const deploymentPhaseTypeApi = createApi({
	reducerPath: 'deploymentPhaseTypeApi',
	baseQuery: fetchAuthQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/software/deployment-process/phase/type`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingDeploymentPhaseTypes', 'DeploymentPhaseType'],
	endpoints: (builder) => ({
		getAllPhaseTypesByUserId: builder.query<
			PagingWrapper<DeploymentPhaseType>,
			GetAllDeploymentPhaseTypeQuery
		>({
			query: ({ userId, name, pageNumber, pageSize }) => ({
				url: `${userId}/user`,
				method: 'GET',
				params: {
					name: name,
					pageNumber,
					pageSize,
				},
			}),
			providesTags(result) {
				const pagingTag = {
					type: 'PagingDeploymentPhaseTypes',
					id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
				} as const;

				return result
					? [
							...result.content.map(
								({ id }) => ({ type: 'DeploymentPhaseType', id }) as const
							),
							pagingTag,
						]
					: [pagingTag];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<DeploymentPhaseTypeResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getPhaseTypeById: builder.query<DeploymentPhaseType, string>({
			query: (softwareId: string) => ({
				url: `/${softwareId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'DeploymentPhaseType',
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
		postPhaseType: builder.mutation<
			DeploymentPhaseType,
			DeploymentPhaseTypeCreateRequest
		>({
			query: ({ userId, name, description }) => ({
				url: `/${userId}`,
				method: 'POST',
				body: {
					name: name,
					description: description,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingDeploymentPhaseTypes' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: SoftwareResponse) {
				return toEntity(rawResult);
			},
		}),
		putPhaseType: builder.mutation<void, DeploymentPhaseTypeUpdateRequest>({
			query: ({ typeId, name, description }) => ({
				url: `/${typeId}`,
				method: 'PUT',
				body: {
					name: name,
					description: description,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { typeId } = arg;
				return [
					{ type: 'PagingDeploymentPhaseTypes' } as const,
					{ type: 'DeploymentPhaseType', id: typeId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deletePhaseType: builder.mutation<void, string>({
			query: (typeId: string) => ({
				url: `/${typeId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const productId = arg;
				return [
					{ type: 'PagingDeploymentPhaseTypes' } as const,
					{ type: 'DeploymentPhaseType', id: productId } as const,
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
	useGetAllPhaseTypesByUserIdQuery,
	useGetPhaseTypeByIdQuery,
	usePostPhaseTypeMutation,
	usePutPhaseTypeMutation,
	useDeletePhaseTypeMutation,
} = deploymentPhaseTypeApi;
