import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/deployment-process-mapper';
import { axiosBaseQuery } from '../utils';
import { sdpInstance } from './instance';

const EXTENSION_URL = 'v1/software/deployment-process';
export const deploymentProcessApi = createApi({
	reducerPath: 'deploymentProcessApi',
	baseQuery: axiosBaseQuery(sdpInstance),
	tagTypes: [
		'PagingDeploymentProcess',
		'DeploymentProcess',
		'Member',
		'Module',
		'Customer',
	],
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
				url: `/${EXTENSION_URL}`,
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
				return result
					? [
							{
								type: 'PagingDeploymentProcess',
								id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
							} as const,
						]
					: [];
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
				url: `/${EXTENSION_URL}/${processId}`,
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
			transformResponse(rawResult: DeploymentProcessResponse) {
				return toEntity(rawResult);
			},
		}),
		getMemberIds: builder.query<Array<string>, number>({
			query: (processId) => ({
				url: `/${EXTENSION_URL}/${processId}/member`,
				method: 'GET',
			}),
			providesTags(result, _err, arg) {
				const processId = arg;
				return result
					? [
							{
								type: 'Member',
								id: processId,
							} as const,
						]
					: [];
			},
		}),
		getAllModules: builder.query<Array<ModuleInDeploymentProcess>, number>({
			query: (processId) => ({
				url: `/${EXTENSION_URL}/${processId}/module-version`,
				method: 'GET',
			}),
			providesTags(result, _err, arg) {
				const processId = arg;
				return result
					? [
							{
								type: 'Module',
								id: processId,
							} as const,
						]
					: [];
			},
			transformResponse(rawResults: Array<ModuleInDeploymentProcessResponse>) {
				return rawResults.map((result) => ({ ...result }));
			},
		}),
		postProcess: builder.mutation<
			DeploymentProcess,
			DeploymentProcessCreateRequest
		>({
			query: ({ userId, softwareVersionId, customerId, moduleVersionIds }) => ({
				url: `/${EXTENSION_URL}/${userId}`,
				method: 'POST',
				body: {
					softwareVersionId: softwareVersionId,
					customerId: customerId,
					moduleVersionIds: moduleVersionIds,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingDeploymentProcess' } as const];
			},
			transformResponse: toEntity,
		}),
		putProcess: builder.mutation<void, DeploymentProcessUpdateRequest>({
			query: ({ processId, status }) => ({
				url: `/${EXTENSION_URL}/${processId}`,
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
		}),
		putMember: builder.mutation<void, DeploymentProcessMemberUpdateRequest>({
			query: ({ processId, memberId, operator }) => ({
				url: `/${EXTENSION_URL}/${processId}/member`,
				method: 'PUT',
				body: {
					memberId: memberId,
					operator: operator,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { processId } = arg;
				return [{ id: processId, type: 'Member' } as const];
			},
		}),
		deleteProcess: builder.mutation<void, number>({
			query: (processId: number) => ({
				url: `/${EXTENSION_URL}/${processId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const processId = arg;
				return [
					{ type: 'PagingDeploymentProcess' } as const,
					{ type: 'DeploymentProcess', id: processId } as const,
				];
			},
		}),
		getSoftwareVersionByCustomerId: builder.query<
			PagingWrapper<DeploymentProcessHasSoftwareVersionResponse>,
			GetSoftwareVersionOfDeploymentProcessByCustomerQuery
		>({
			query: ({
				customerId,
				softwareName,
				softwareVersionName,
				pageNumber,
				pageSize,
			}) => ({
				url: `/${EXTENSION_URL}/${customerId}/customer`,
				method: 'GET',
				params: {
					softwareName: softwareName,
					softwareVersionName: softwareVersionName,
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),

			providesTags(result, _err, arg) {
				const {
					customerId,
					softwareName,
					softwareVersionName,
					pageNumber,
					pageSize,
				} = arg;
				return result
					? [
							{
								type: 'Customer',
								id: `${customerId}-${softwareName}-${softwareVersionName}-${pageNumber}-${pageSize}`,
							} as const,
						]
					: [];
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllProcessesQuery,
	useGetProcessQuery,
	useGetMemberIdsQuery,
	useGetAllModulesQuery,
	useGetSoftwareVersionByCustomerIdQuery,
	usePostProcessMutation,
	usePutProcessMutation,
	usePutMemberMutation,
	useDeleteProcessMutation,
} = deploymentProcessApi;
