import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/deployment-process-mapper';
import { axiosBaseQuery } from '../utils';
import { softwareInst, userInst } from './instance';
import { AxiosError } from 'axios';

const EXTENSION_URL = 'deployment-process';
export const deploymentProcessApi = createApi({
	reducerPath: 'deploymentProcessApi',
	baseQuery: axiosBaseQuery(softwareInst),
	tagTypes: ['PagingDeploymentProcess', 'DeploymentProcess', 'Member'],
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
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: DeploymentProcessResponse) {
				return toEntity(rawResult);
			},
		}),
		getMembers: builder.query<Array<UserMetadata>, number>({
			async queryFn(processId) {
				try {
					const memberIds: Array<string> = (
						await softwareInst.get(`/${EXTENSION_URL}/${processId}/member`, {})
					).data;

					const users = await Promise.all(
						memberIds.map(async (id) => {
							const response: UserRepresentation = (
								await userInst.get(`/users/${id}`)
							).data;
							return response as UserMetadata;
						})
					);
					return { data: users };
				} catch (axiosError) {
					const err = axiosError as AxiosError;
					return {
						error: {
							status: err.response!.status!,
							data: err.response?.data || err.message,
						},
					};
				}
			},
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
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: DeploymentProcessResponse) {
				return toEntity(rawResult);
			},
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
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
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
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
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
	useGetMembersQuery,
	usePostProcessMutation,
	usePutProcessMutation,
	usePutMemberMutation,
	useDeleteProcessMutation,
} = deploymentProcessApi;
