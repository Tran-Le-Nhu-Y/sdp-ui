import { Stack, Tooltip, Typography } from '@mui/material';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PathHolders, RoutePaths } from '../../utils';
import { CustomDataGrid } from '../../components';
import { useGetAllExpiredLicenses } from '../../services';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const ExpiredSoftwareLicensesPage = () => {
	const { t } = useTranslation('standard');
	const navigate = useNavigate();
	const [expiredLicensesQuery, setExpiredLicensesQuery] =
		useState<GetAllExpiredSoftwareLicensesQuery>({
			pageNumber: 0,
			pageSize: 5,
		});
	const expiredLicenses = useGetAllExpiredLicenses(expiredLicensesQuery);

	const cols: GridColDef<SoftwareLicense>[] = useMemo(
		() => [
			{
				field: 'id',
				headerName: t('softwareLicenseId'),
				headerAlign: 'center',
				type: 'string',
				minWidth: 250,
			},
			{
				field: 'startTime',
				headerName: t('licenseStartTime'),
				headerAlign: 'center',
				align: 'center',
				type: 'string',
				minWidth: 150,
			},
			{
				field: 'endTime',
				headerName: t('licenseEndTime'),
				headerAlign: 'center',
				align: 'center',
				type: 'string',
				minWidth: 150,
			},
			{
				field: 'createdAt',
				headerName: t('dateCreated'),
				headerAlign: 'center',
				align: 'center',
				type: 'string',
				minWidth: 150,
			},
			{
				field: 'updatedAt',
				headerName: t('updatedDate'),
				headerAlign: 'center',
				align: 'center',
				type: 'string',
				minWidth: 150,
			},
			{
				field: 'expireAlertIntervalDay',
				headerName: t('expiredAlertIntervalDays'),
				headerAlign: 'center',
				align: 'center',
				type: 'string',
				minWidth: 100,
				valueGetter: (value) => {
					return `${value} ${t('days')}`;
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
							<Tooltip arrow title={t('seeDetail')}>
								<VisibilityIcon color="primary" />
							</Tooltip>
						}
						label={t('seeDetail')}
						onClick={() => {
							const path = RoutePaths.SOFTWARE_LICENSE_DETAIL.replace(
								`:${PathHolders.SOFTWARE_LICENSE_ID}`,
								params.row.id
							);
							navigate(path);
						}}
					/>,
				],
			},
		],
		[navigate, t]
	);

	return (
		<Stack spacing={2}>
			<Typography></Typography>
			<CustomDataGrid
				columns={cols}
				rows={expiredLicenses.data?.content}
				paginationMeta={{
					hasNextPage:
						expiredLicenses.currentData?.last !== undefined
							? !expiredLicenses.currentData.last
							: undefined,
				}}
				rowCount={expiredLicenses.data?.totalElements ?? 0}
				loading={expiredLicenses.isLoading || expiredLicenses.isFetching}
				pageSizeOptions={[5, 10, 15]}
				onPaginationModelChange={(model) => {
					setExpiredLicensesQuery((pre) => ({
						...pre,
						pageNumber: model.page,
						pageSize: model.pageSize,
					}));
				}}
				paginationMode="server"
				paginationModel={{
					page: expiredLicensesQuery.pageNumber ?? 0,
					pageSize: expiredLicensesQuery.pageSize ?? 5,
				}}
				initialState={{
					pagination: {
						paginationModel: {
							page: expiredLicensesQuery.pageNumber ?? 0,
							pageSize: expiredLicensesQuery.pageSize ?? 5,
						},
					},
				}}
			/>
		</Stack>
	);
};

export default ExpiredSoftwareLicensesPage;
