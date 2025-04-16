import { Typography, Stack, LinearProgress } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomDataGrid } from '../../components';
import {
	useGetAllUsersByRole,
	useGetDeploymentPhaseMemberIds,
} from '../../services';
import {
	GridColDef,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid';

export default function PersonnelTab({ phaseId }: { phaseId: string }) {
	const { t } = useTranslation('standard');
	const userQuery = useGetAllUsersByRole('deployment_person');
	const memberIdQuery = useGetDeploymentPhaseMemberIds(phaseId);

	const findUsers = useCallback(
		(isSelected: boolean) => {
			const memberIds = memberIdQuery.data;
			if (!memberIds) return [];

			return (
				userQuery?.data?.filter((user) => {
					const selected = memberIds.includes(user.id);
					return isSelected ? selected : !selected;
				}) ?? []
			);
		},
		[memberIdQuery?.data, userQuery?.data]
	);

	const unselectedUsers = useMemo(() => findUsers(false), [findUsers]);
	const unselectedCols: GridColDef[] = useMemo(
		() => [
			{
				field: 'fullName',
				headerName: t('fullName'),
				editable: false,
				width: 200,
				type: 'string',
				valueGetter: (_value, row) => {
					return `${row.lastName || ''} ${row.firstName || ''}`;
				},
			},
			{
				field: 'email',
				editable: false,
				minWidth: 200,
				headerName: t('emailAddress'),
				type: 'string',
			},
		],
		[t]
	);

	const selectedUsers = useMemo(() => findUsers(true), [findUsers]);
	const selectedCols: GridColDef[] = useMemo(
		() => [
			{
				field: 'fullName',
				headerName: t('fullName'),
				editable: false,
				width: 200,
				valueGetter: (_value, row) => {
					return `${row.lastName || ''} ${row.firstName || ''}`;
				},
			},
			{
				field: 'email',
				editable: false,
				minWidth: 200,
				headerName: t('emailAddress'),
			},
		],
		[t]
	);

	if (userQuery.isLoading || memberIdQuery.isLoading) return <LinearProgress />;
	return (
		<Stack
			direction={{
				xs: 'column',
				sm: 'row',
			}}
			justifyContent={'space-around'}
			spacing={2}
		>
			<Stack direction={'column'} spacing={1}>
				<Typography variant="h6">{t('unassignedPersonnel')}</Typography>
				<CustomDataGrid
					slots={{
						toolbar: () => (
							<GridToolbarContainer>
								<GridToolbarFilterButton />
								<GridToolbarDensitySelector />
								<GridToolbarColumnsButton />
								<GridToolbarQuickFilter />
							</GridToolbarContainer>
						),
					}}
					rows={unselectedUsers}
					columns={unselectedCols}
					pageSizeOptions={[5, 10, 15]}
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
			<Stack direction={'column'} spacing={1}>
				<Typography variant="h6">{t('assignedPersonnel')}</Typography>
				<CustomDataGrid
					slots={{
						toolbar: () => (
							<GridToolbarContainer>
								<GridToolbarFilterButton />
								<GridToolbarDensitySelector />
								<GridToolbarColumnsButton />
								<GridToolbarQuickFilter />
							</GridToolbarContainer>
						),
					}}
					rows={selectedUsers}
					columns={selectedCols}
					pageSizeOptions={[5, 10, 15]}
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
		</Stack>
	);
}
