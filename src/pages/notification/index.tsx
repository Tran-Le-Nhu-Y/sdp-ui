import { useTranslation } from 'react-i18next';
import { useNotifications, useSession } from '@toolpad/core';
import {
	darken,
	lighten,
	Stack,
	Theme,
	Tooltip,
	useTheme,
} from '@mui/material';
import { CustomDataGrid } from '../../components';
import { useMemo, useState } from 'react';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import {
	useDeleteNotificationHistory,
	useGetAllNotificationHistories,
	useUpdateNotificationHistory,
} from '../../services';
import { HideDuration } from '../../utils';
import DeleteIcon from '@mui/icons-material/Delete';

const getBackgroundColor = (
	color: string,
	theme: Theme,
	coefficient: number
) => ({
	backgroundColor: darken(color, coefficient),
	...theme.applyStyles('light', {
		backgroundColor: lighten(color, coefficient),
	}),
});

export default function NotificationPage() {
	const { t } = useTranslation('standard');
	const theme = useTheme();
	const notifications = useNotifications();
	const userId = useSession()?.user?.id ?? '';

	const [historiesQuery, setHistoriesQuery] =
		useState<GetAllNotificationHistoriesQuery>({
			userId: userId,
			pageNumber: 0,
			pageSize: 5,
		});
	const histories = useGetAllNotificationHistories(historiesQuery);
	const [updateHistoryTrigger] = useUpdateNotificationHistory();
	const [deleteHistoryTrigger] = useDeleteNotificationHistory();

	const cols: GridColDef[] = useMemo(
		() => [
			{
				field: 'title',
				headerName: t('title'),
				type: 'string',
				minWidth: 250,
				valueGetter: (_value, row) => {
					return row.notification.title;
				},
			},
			{
				field: 'description',
				headerName: t('description'),
				type: 'string',
				minWidth: 350,
				valueGetter: (_value, row) => {
					return row.notification.description ?? t('noDescription');
				},
			},
			{
				field: 'createdAt',
				headerName: t('dateCreated'),
				headerAlign: 'center',
				align: 'center',
				type: 'dateTime',
				minWidth: 150,
				valueGetter: (_value, row) => {
					return new Date(row.createdAtMs);
				},
			},
			{
				field: 'actions',
				type: 'actions',
				headerName: t('action'),
				width: 100,
				getActions: (params) => [
					<GridActionsCellItem
						icon={
							<Tooltip
								arrow
								title={params.row.isRead ? t('unreadMarkup') : t('readMarkup')}
							>
								{params.row.isRead ? (
									<MarkChatUnreadIcon />
								) : (
									<MarkChatReadIcon color="primary" />
								)}
							</Tooltip>
						}
						label={params.row.isRead ? t('unreadMarkup') : t('readMarkup')}
						onClick={() => {
							const history: NotificationHistory = params.row;
							updateHistoryTrigger({
								numOrder: history.numOrder,
								notificationId: history.notification.id,
								userId: userId,
								isRead: !history.isRead,
							}).catch((error) => {
								console.error(error);
								notifications.show(t('updateNotificationHistoryError'), {
									autoHideDuration: HideDuration.fast,
									severity: 'error',
								});
							});
						}}
					/>,
					<GridActionsCellItem
						icon={
							<Tooltip arrow title={t('delete')}>
								<DeleteIcon color="error" />
							</Tooltip>
						}
						label={params.row.isRead ? t('unreadMarkup') : t('readMarkup')}
						onClick={() => {
							const history: NotificationHistory = params.row;
							deleteHistoryTrigger({
								numOrder: history.numOrder,
								notificationId: history.notification.id,
								userId: userId,
							}).catch((error) => {
								console.error(error);
								notifications.show(t('deleteNotificationHistoryError'), {
									autoHideDuration: HideDuration.fast,
									severity: 'error',
								});
							});
						}}
					/>,
				],
			},
		],
		[deleteHistoryTrigger, notifications, t, updateHistoryTrigger, userId]
	);

	return (
		<Stack direction={'column'} alignItems={'center'} spacing={2}>
			<CustomDataGrid
				sx={{
					'& .sdp-notification-isRead--true': {
						...getBackgroundColor(theme.palette.grey[300], theme, 0.7),
					},
				}}
				disableColumnFilter
				disableColumnSorting
				getRowClassName={(params) =>
					`sdp-notification-isRead--${params.row.isRead}`
				}
				columns={cols}
				rows={histories.data?.content}
				paginationMeta={{
					hasNextPage:
						histories.currentData?.last !== undefined
							? !histories.currentData.last
							: undefined,
				}}
				rowCount={histories.data?.totalElements ?? 0}
				loading={histories.isLoading || histories.isFetching}
				pageSizeOptions={[5, 10, 15]}
				onPaginationModelChange={(model) => {
					setHistoriesQuery((pre) => ({
						...pre,
						pageNumber: model.page,
						pageSize: model.pageSize,
					}));
				}}
				paginationMode="server"
				paginationModel={{
					page: historiesQuery.pageNumber ?? 0,
					pageSize: historiesQuery.pageSize ?? 5,
				}}
				getRowId={(row) => `${row.numOrder}-${row.notification.id}`}
				initialState={{
					pagination: {
						paginationModel: {
							page: historiesQuery.pageNumber ?? 0,
							pageSize: historiesQuery.pageSize ?? 5,
						},
					},
				}}
			/>
		</Stack>
	);
}
