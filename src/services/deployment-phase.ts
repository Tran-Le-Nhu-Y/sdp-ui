import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/deployment-phase';

export const deploymentPhaseApi = createApi({
	reducerPath: 'deploymentPhaseApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_API_GATEWAY}/software/deployment-process/phase`,
		jsonContentType: 'application/json',
		timeout: 300000,
	}),
	tagTypes: ['PagingDeploymentPhases', 'DeploymentPhase'],
	endpoints: (builder) => ({
		getAllPhasesByProcessId: builder.query<
			PagingWrapper<DeploymentPhase>,
			GetAllDeploymentPhaseQuery
		>({
			query: ({ processId }) => ({
				url: `${processId}/process`,
				method: 'GET',
			}),
			providesTags(result) {
				const pagingTag = {
					type: 'PagingDeploymentPhases',
					id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
				} as const;

				return result
					? [
							...result.content.map(
								({ id }) => ({ type: 'DeploymentPhase', id }) as const,
							),
							pagingTag,
						]
					: [pagingTag];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: PagingWrapper<DeploymentPhaseResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getPhaseById: builder.query<DeploymentPhase, string>({
			query: (phaseId: string) => ({
				url: `/${phaseId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'DeploymentPhase',
								id: result.id,
							} as const,
						]
					: [];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: DeploymentPhaseResponse) {
				return toEntity(rawResult);
			},
		}),
		postPhase: builder.mutation<DeploymentPhase, DeploymentPhaseCreateRequest>({
			query: ({ processId, numOrder, description, typeId }) => ({
				url: `/${processId}`,
				method: 'POST',
				body: {
					numOrder: numOrder,
					description: description,
					phaseTypeId: typeId,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingDeploymentPhases' } as const];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: DeploymentPhaseResponse) {
				return toEntity(rawResult);
			},
		}),
		putPhase: builder.mutation<void, DeploymentPhaseUpdateRequest>({
			query: ({ phaseId, numOrder, description }) => ({
				url: `/${phaseId}`,
				method: 'PUT',
				body: {
					numOrder: numOrder,
					description: description,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { phaseId } = arg;
				return [
					{ type: 'PagingDeploymentPhases' } as const,
					{ type: 'DeploymentPhase', id: phaseId } as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
		deletePhase: builder.mutation<void, string>({
			query: (softwareId: string) => ({
				url: `/${softwareId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const productId = arg;
				return [
					{ type: 'PagingDeploymentPhases' } as const,
					{ type: 'DeploymentPhase', id: productId } as const,
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
	useGetAllPhasesByProcessIdQuery,
	useGetPhaseByIdQuery,
	usePostPhaseMutation,
	usePutPhaseMutation,
	useDeletePhaseMutation,
} = deploymentPhaseApi;
