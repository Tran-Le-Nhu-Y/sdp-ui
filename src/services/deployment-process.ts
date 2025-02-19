import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/deployment-process-mapper';

export const deploymentProcessApi = createApi({
	reducerPath: 'deploymentProcessApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/software/deployment-process`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingDeploymentProcess', 'DeploymentProcess'],
	endpoints: (builder) => ({
		getAllProcesses: builder.query<
			PagingWrapper<DeploymentProcess>,
			GetAllDeploymentProcessQuery
		>({
			query: ({
				softwareVersionName,
				customerName,
				status,
				pageNumber,
				pageSize,
			}) => ({
				url: ``,
				method: 'GET',
				params: {
					softwareVersionName: softwareVersionName,
					customerName: customerName,
					status: status,
					pageNumber,
					pageSize,
				},
			}),
			providesTags(result) {
				const pagingTag = {
					type: 'PagingDeploymentProcess',
					id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
				} as const;

				return result
					? [
							...result.content.map(
								({ id }) => ({ type: 'DeploymentProcess', id }) as const
							),
							pagingTag,
						]
					: [pagingTag];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<DeploymentProcessResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getProcess: builder.query<DeploymentProcess, string>({
			query: (processId) => ({
				url: `/${processId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'DeploymentProcess',
								id: result.id,
							} as const,
						]
					: [];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: DeploymentProcessResponse) {
				return toEntity(rawResult);
			},
		}),
		postProcess: builder.mutation<
			DeploymentProcess,
			DeploymentProcessCreateRequest
		>({
			query: ({ userId, softwareVersionId, customerId }) => ({
				url: `/${userId}`,
				method: 'POST',
				body: {
					softwareVersionId: softwareVersionId,
					customerId: customerId,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingDeploymentProcess' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: DeploymentProcessResponse) {
				return toEntity(rawResult);
			},
		}),
		putProcess: builder.mutation<void, DeploymentProcessUpdateRequest>({
			query: ({ processId, status }) => ({
				url: `/${processId}`,
				method: 'PUT',
				body: {
					status: status,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { processId } = arg;
				return [
					{ type: 'PagingDeploymentProcess' } as const,
					{ type: 'DeploymentProcess', id: processId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deleteProcess: builder.mutation<void, number>({
			query: (processId: number) => ({
				url: `/${processId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const processId = arg;
				return [
					{ type: 'PagingDeploymentProcess' } as const,
					{ type: 'DeploymentProcess', id: processId } as const,
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
	useGetAllProcessesQuery,
	useGetProcessQuery,
	usePostProcessMutation,
	usePutProcessMutation,
	useDeleteProcessMutation,
} = deploymentProcessApi;
