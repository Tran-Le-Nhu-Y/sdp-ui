import { Typography, Stack, LinearProgress } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomDataGrid } from '../../components';
import {
	useGetAllUsersByRole,
	useGetDeploymentPhaseMembers,
	useGetDeploymentProcessMemberIds,
} from '../../services';
import {
	GridColDef,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid';

export default function PersonnelTab({
	processId,
	phaseId,
}: {
	processId: number;
	phaseId: string;
}) {
	const { t } = useTranslation('standard');
	const userQuery = useGetAllUsersByRole('deployment_person');
	const processMemberIdQuery = useGetDeploymentProcessMemberIds(processId);
	const membersQuery = useGetDeploymentPhaseMembers(phaseId);

	const unselectedUsers = useMemo(() => {
		const members = membersQuery.data;
		if (!members) return userQuery?.data ?? [];

		return (
			userQuery?.data
				?.filter((user) => {
					const isProcessMember = processMemberIdQuery.data?.includes(user.id);
					return isProcessMember;
				})
				?.filter((user) => {
					const isExist = members.find((member) => member.id === user.id);
					return !isExist;
				}) ?? []
		);
	}, [membersQuery.data, processMemberIdQuery.data, userQuery?.data]);
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

	if (userQuery.isLoading || membersQuery.isLoading) return <LinearProgress />;
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
					rows={membersQuery.data ?? []}
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
