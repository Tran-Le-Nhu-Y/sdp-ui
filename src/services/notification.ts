import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../utils';
import { sdpInstance } from './instance';
import { toEntity, toHistoryEntity } from './mapper/notification-mapper';

const EXTENSION_URL = 'v1/notification';
export const notificationApi = createApi({
	reducerPath: 'notificationApi',
	baseQuery: axiosBaseQuery(sdpInstance),
	tagTypes: ['PagingHistories', 'Notification', 'TotalHistories'],
	endpoints: (builder) => ({
		getNewestNotification: builder.mutation<SdpNotification, number>({
			query: (notificationId) => ({
				url: `/${EXTENSION_URL}/${notificationId}`,
				method: 'GET',
			}),
			invalidatesTags(_result, error) {
				return !error
					? [
							{ type: 'PagingHistories' } as const,
							{
								type: 'TotalHistories',
								id: 'isRead-false',
							} as const,
						]
					: [];
			},
			transformResponse: toEntity,
		}),
		countHistories: builder.query<number, GetCountNotificationHistoriesQuery>({
			query: ({ userId, isRead }) => ({
				url: `/${EXTENSION_URL}/history/${userId}/count`,
				method: 'GET',
				params: {
					isRead: isRead,
				},
			}),
			providesTags(result, _error, args) {
				const { isRead } = args;
				return result
					? [
							{
								type: 'TotalHistories',
								id: `isRead-${isRead}`,
							} as const,
						]
					: [];
			},
		}),
		getAllHistories: builder.query<
			PagingWrapper<NotificationHistory>,
			GetAllNotificationHistoriesQuery
		>({
			query: ({ userId, pageNumber, pageSize }) => ({
				url: `/${EXTENSION_URL}/history/${userId}`,
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
								type: 'PagingHistories',
								id: `${result?.number}-${result?.totalPages}-${result?.size}-${result?.numberOfElements}-${result?.totalElements}`,
							} as const,
						]
					: [];
			},
			transformResponse(rawResult: PagingWrapper<NotificationHistoryResponse>) {
				const content = rawResult.content.map(toHistoryEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		putHistory: builder.mutation<
			void,
			NotificationHistoryRequest & { isRead: boolean }
		>({
			query: ({ numOrder, notificationId, userId, isRead }) => ({
				url: `/${EXTENSION_URL}/history`,
				method: 'PUT',
				body: {
					numOrder: numOrder,
					notificationId: notificationId,
					userId: userId,
					isRead: isRead,
				},
			}),
			invalidatesTags(_result, error) {
				return !error
					? [
							{ type: 'PagingHistories' } as const,
							{
								type: 'TotalHistories',
							} as const,
						]
					: [];
			},
		}),
		deleteHistory: builder.mutation<void, NotificationHistoryRequest>({
			query: ({ numOrder, notificationId, userId }) => ({
				url: `/${EXTENSION_URL}/history/${numOrder}/${notificationId}/${userId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, error) {
				return !error
					? [
							{ type: 'PagingHistories' } as const,
							{
								type: 'TotalHistories',
							} as const,
						]
					: [];
			},
		}),
		deleteAllHistories: builder.mutation<void, string>({
			query: (userId: string) => ({
				url: `/${EXTENSION_URL}/history/${userId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, error) {
				return !error ? [{ type: 'PagingHistories' } as const] : [];
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetNewestNotificationMutation,
	useCountHistoriesQuery,
	useGetAllHistoriesQuery,
	useDeleteAllHistoriesMutation,
	useDeleteHistoryMutation,
	usePutHistoryMutation,
} = notificationApi;
