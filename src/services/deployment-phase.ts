import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/deployment-phase';
import { axiosBaseQuery } from '../utils';
import { sdpInstance } from './instance';

const EXTENSION_URL = 'v1/software/deployment-process/phase';
export const deploymentPhaseApi = createApi({
	reducerPath: 'deploymentPhaseApi',
	baseQuery: axiosBaseQuery(sdpInstance),
	tagTypes: ['ProcessPhases', 'DeploymentPhase'],
	endpoints: (builder) => ({
		getAllPhasesByProcessId: builder.query<
			Array<DeploymentPhase>,
			GetAllDeploymentPhaseQuery
		>({
			query: ({ processId }) => ({
				url: `/${EXTENSION_URL}/${processId}/process`,
				method: 'GET',
			}),
			providesTags(result, _err, arg) {
				const { processId } = arg;
				return result
					? [
							{
								type: 'ProcessPhases',
								id: processId,
							} as const,
						]
					: [];
			},
			transformResponse(rawResult: Array<DeploymentPhaseResponse>) {
				return rawResult.map(toEntity);
			},
		}),
		getPhaseById: builder.query<DeploymentPhase, string>({
			query: (phaseId: string) => ({
				url: `/${EXTENSION_URL}/${phaseId}`,
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
			transformResponse(rawResult: DeploymentPhaseResponse) {
				return toEntity(rawResult);
			},
		}),
		postPhase: builder.mutation<string, DeploymentPhaseCreateRequest>({
			query: ({
				processId,
				numOrder,
				description,
				typeId,
				plannedStartDate,
				plannedEndDate,
			}) => ({
				url: `/${EXTENSION_URL}/${processId}`,
				method: 'POST',
				body: {
					numOrder: numOrder,
					description: description,
					phaseTypeId: typeId,
					plannedStartDate: plannedStartDate,
					plannedEndDate: plannedEndDate,
				},
			}),
			invalidatesTags() {
				return [{ type: 'ProcessPhases' } as const];
			},
		}),
		putPhase: builder.mutation<void, DeploymentPhaseUpdateRequest>({
			query: ({ phaseId, numOrder, description }) => ({
				url: `/${EXTENSION_URL}/${phaseId}`,
				method: 'PUT',
				body: {
					numOrder: numOrder,
					description: description,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { phaseId } = arg;
				return [
					{ type: 'ProcessPhases' } as const,
					{ type: 'DeploymentPhase', id: phaseId } as const,
				];
			},
		}),
		deletePhase: builder.mutation<void, string>({
			query: (softwareId: string) => ({
				url: `/${EXTENSION_URL}/${softwareId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const productId = arg;
				return [
					{ type: 'ProcessPhases' } as const,
					{ type: 'DeploymentPhase', id: productId } as const,
				];
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
