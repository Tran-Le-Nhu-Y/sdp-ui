import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../utils';
import { sdpInstance } from './instance';
import { toEntity } from './mapper/notification-mapper';

const EXTENSION_URL = 'v1/notification';
export const notificationApi = createApi({
	reducerPath: 'notificationApi',
	baseQuery: axiosBaseQuery(sdpInstance),
	tagTypes: ['PagingHistories', 'Notification'],
	endpoints: (builder) => ({
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
				const content = rawResult.content.map(toEntity);
				return {
					...rawResult,
					content,
				};
			},
		}),
		putHistory: builder.mutation<void, NotificationHistoryRequest>({
			query: ({ numOrder, notificationId, userId }) => ({
				url: `/${EXTENSION_URL}/history/${numOrder}/${notificationId}/${userId}`,
				method: 'PUT',
			}),
			invalidatesTags(_result, error) {
				return !error ? [{ type: 'PagingHistories' } as const] : [];
			},
		}),
		deleteHistory: builder.mutation<void, NotificationHistoryRequest>({
			query: ({ numOrder, notificationId, userId }) => ({
				url: `/${EXTENSION_URL}/history/${numOrder}/${notificationId}/${userId}`,
				method: 'DELETE',
			}),
			invalidatesTags(_result, error) {
				return !error ? [{ type: 'PagingHistories' } as const] : [];
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
	useGetAllHistoriesQuery,
	useDeleteAllHistoriesMutation,
	useDeleteHistoryMutation,
	usePutHistoryMutation,
} = notificationApi;
