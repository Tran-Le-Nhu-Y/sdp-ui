import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery, axiosQueryHandler } from '../utils';
import { sdpInstance } from './instance';
import { toDetailEntity, toEntity } from './mapper/software-license-mapper';
import { getUserMetadata } from './api/keycloak-api';

const EXTENSION_URL = 'v1/software/deployment-process/license';
export const softwareLicenseApi = createApi({
	reducerPath: 'softwareLicenseApi',
	baseQuery: axiosBaseQuery(sdpInstance),
	tagTypes: [
		'PagingLicenses',
		'PagingExpiredLicenses',
		'License',
		'LicenseDetail',
	],
	endpoints: (builder) => ({
		getAllByProcessId: builder.query<
			PagingWrapper<SoftwareLicense>,
			GetAllProcessSoftwareLicensesQuery
		>({
			query: ({ processId, pageNumber, pageSize }) => ({
				url: `/${EXTENSION_URL}/${processId}/process`,
				method: 'GET',
				params: {
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'PagingLicenses',
								id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
							} as const,
						]
					: [];
			},
			transformResponse(rawResult: PagingWrapper<SoftwareLicenseResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getAllExpired: builder.query<
			PagingWrapper<SoftwareLicense>,
			GetAllExpiredSoftwareLicensesQuery
		>({
			query: ({ pageNumber, pageSize }) => ({
				url: `/${EXTENSION_URL}/expire`,
				method: 'GET',
				params: {
					pageNumber: pageNumber,
					pageSize: pageSize,
				},
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'PagingExpiredLicenses',
								id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
							} as const,
						]
					: [];
			},
			transformResponse(rawResult: PagingWrapper<SoftwareLicenseResponse>) {
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		getById: builder.query<SoftwareLicense, string>({
			query: (licenseId: string) => ({
				url: `/${EXTENSION_URL}/${licenseId}`,
				method: 'GET',
			}),
			providesTags(result) {
				return result
					? [
							{
								type: 'License',
								id: result.id,
							} as const,
						]
					: [];
			},
			transformResponse: toEntity,
		}),
		getDetailById: builder.query<SoftwareLicenseDetail, string>({
			async queryFn(arg) {
				const licenseId = arg;
				const func = async () => {
					const response = await sdpInstance.get(
						`/${EXTENSION_URL}/${licenseId}/detail`
					);
					const license: SoftwareLicenseDetailResponse = response.data;
					const licenseCreator = await getUserMetadata(
						license.licenseCreatorId
					);
					return toDetailEntity(license, licenseCreator);
				};
				return axiosQueryHandler(func);
			},
			providesTags(result) {
				return result
					? [
							{
								type: 'LicenseDetail',
								id: result.id,
							} as const,
						]
					: [];
			},
		}),
		post: builder.mutation<SoftwareLicense, SoftwareLicenseCreateRequest>({
			query: (data: SoftwareLicenseCreateRequest) => ({
				url: `/${EXTENSION_URL}/${data.userId}`,
				method: 'POST',
				body: {
					processId: data.processId,
					description: data.description,
					startTimeMs: data.startTimeMs,
					endTimeMs: data.endTimeMs,
					expireAlertIntervalDay: data.expireAlertIntervalDay,
				},
			}),
			invalidatesTags() {
				return [{ type: 'PagingLicenses' } as const];
			},
			transformResponse: toEntity,
		}),
		put: builder.mutation<void, SoftwareLicenseUpdateRequest>({
			query: (data: SoftwareLicenseUpdateRequest) => ({
				url: `/${EXTENSION_URL}/${data.licenseId}`,
				method: 'PUT',
				body: {
					description: data.description,
					expireAlertIntervalDay: data.expireAlertIntervalDay,
				},
			}),
			invalidatesTags(_result, _error, arg) {
				const { licenseId } = arg;
				return [
					{ type: 'PagingLicenses' } as const,
					{ type: 'PagingExpiredLicenses' } as const,
					{ type: 'License', id: licenseId } as const,
					{ type: 'LicenseDetail', id: licenseId } as const,
				];
			},
		}),
		delete: builder.mutation<void, string>({
			query: (licenseId: string) => ({
				url: `/${EXTENSION_URL}/${licenseId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, _error, arg) {
				const licenseId = arg;
				return [
					{ type: 'PagingLicenses' } as const,
					{ type: 'PagingExpiredLicenses' } as const,
					{ type: 'License', id: licenseId } as const,
					{ type: 'LicenseDetail', id: licenseId } as const,
				];
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetAllByProcessIdQuery,
	useGetAllExpiredQuery,
	useGetByIdQuery,
	useGetDetailByIdQuery,
	usePostMutation,
	usePutMutation,
	useDeleteMutation,
} = softwareLicenseApi;
