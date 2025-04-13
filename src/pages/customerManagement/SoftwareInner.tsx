import { useTranslation } from 'react-i18next';
import { CustomDataGrid } from '../../components';
import { Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useGetSoftwareVersionOfDeploymentProcessByCustomer } from '../../services';
import { useNotifications } from '@toolpad/core';
import { HideDuration } from '../../utils';
import React from 'react';
import {
	GridToolbarContainer,
	GridToolbarFilterButton,
	GridToolbarDensitySelector,
	GridToolbarColumnsButton,
	GridColDef,
} from '@mui/x-data-grid';

export default function SoftwareInner({
	softwareVersionOfProcessQuery,
	setSoftwareVersionOfProcessQuery,
}: {
	softwareVersionOfProcessQuery: GetSoftwareVersionOfDeploymentProcessByCustomerQuery | null;
	setSoftwareVersionOfProcessQuery: React.Dispatch<
		React.SetStateAction<GetSoftwareVersionOfDeploymentProcessByCustomerQuery | null>
	>;
}) {
	//const navigate = useNavigate();
	const { t } = useTranslation('standard');
	const notifications = useNotifications();

	const softwareVersion = useGetSoftwareVersionOfDeploymentProcessByCustomer(
		softwareVersionOfProcessQuery!,
		{
			skip: !softwareVersionOfProcessQuery,
		}
	);
	useEffect(() => {
		if (softwareVersion.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, softwareVersion.isError, t]);

	const softwareVersionCols: GridColDef<SoftwareVersionOfDeploymentProcessAndCustomer>[] =
		useMemo(
			() => [
				{
					field: 'softwareName',
					headerName: t('softwareName'),
					editable: false,
					sortable: false,
					filterable: false,
					width: 200,
					type: 'string',
					valueGetter: (_value, row) => {
						return row.softwareVersion.softwareName;
					},
				},
				{
					field: 'versionName',
					editable: false,
					sortable: false,
					filterable: false,
					minWidth: 200,
					headerName: t('versionName'),
					headerAlign: 'center',
					align: 'center',
					type: 'string',
					valueGetter: (_value, row) => {
						return row.softwareVersion.versionName;
					},
				},
				{
					field: 'processId',
					editable: false,
					sortable: false,
					filterable: false,
					minWidth: 200,
					headerName: t('processId'),
					headerAlign: 'center',
					type: 'number',
				},
			],
			[t]
		);

	return (
		<Stack spacing={1}>
			<Typography variant="h6" textAlign="center">
				{t('softwareUsed')}:
			</Typography>
			<CustomDataGrid
				loading={softwareVersion.isLoading}
				slots={{
					toolbar: () => (
						<GridToolbarContainer>
							<GridToolbarFilterButton />
							<GridToolbarDensitySelector />
							<GridToolbarColumnsButton />
						</GridToolbarContainer>
					),
				}}
				getRowId={(row) =>
					`${row.processId}-${row.customerId}-${row.softwareVersion.softwareId}-${row.softwareVersion.versionId}`
				}
				rows={softwareVersion.data?.content ?? []}
				columns={softwareVersionCols}
				rowCount={softwareVersion.data?.totalElements ?? 0}
				paginationMeta={{ hasNextPage: !softwareVersion.data?.last }}
				paginationMode="server"
				paginationModel={{
					page: softwareVersionOfProcessQuery?.pageNumber ?? 0,
					pageSize: softwareVersionOfProcessQuery?.pageSize ?? 5,
				}}
				onPaginationModelChange={(model) => {
					setSoftwareVersionOfProcessQuery((prev) => ({
						...prev!,
						pageNumber: model.page,
						pageSize: model.pageSize,
					}));
				}}
				pageSizeOptions={[5, 10, 15]}
				filterMode="server"
				onFilterModelChange={(model) => {
					const value = model.items.reduce(
						(acc, item) => {
							if (item.field === 'softwareName') {
								return {
									...acc,
									softwareName: item.value,
								};
							}
							if (item.field === 'versionName')
								return {
									...acc,
									versionName: item.value,
								};
							return acc;
						},
						{ softwareName: '', versionName: '' }
					);
					setSoftwareVersionOfProcessQuery((prev) => ({ ...prev!, ...value }));
				}}
				initialState={{
					pagination: {
						paginationModel: {
							page: 0,
							pageSize: 5,
						},
					},
				}}
			/>
		</Stack>
	);
}
