import { Typography, Stack, LinearProgress, Tooltip } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomDataGrid } from '../../components';
import { HideDuration } from '../../utils';
import {
	useGetAllUsersByRole,
	useGetDeploymentPhaseMembers,
	useGetDeploymentProcessMemberIds,
	useUpdateDeploymentPhaseMember,
} from '../../services';
import { useNotifications } from '@toolpad/core';
import {
	GridActionsCellItem,
	GridColDef,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PersonnelTab({
	processId,
	phaseId,
}: {
	processId: number;
	phaseId: string;
}) {
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
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

	const [updateMemberTrigger, { isLoading: isUpdatingMember }] =
		useUpdateDeploymentPhaseMember();
	const updateMemberHandler = useCallback(
		async (
			request: DeploymentPhaseMemberUpdateRequest,
			successText: string,
			errorText: string
		) => {
			try {
				await updateMemberTrigger(request).unwrap();

				notifications.show(successText, {
					severity: 'success',
					autoHideDuration: HideDuration.fast,
				});
			} catch (error) {
				console.error(error);
				notifications.show(errorText, {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
			}
		},
		[notifications, updateMemberTrigger]
	);

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
			{
				field: 'actions',
				headerName: t('action'),
				type: 'actions',
				width: 40,
				getActions: (params) => [
					<GridActionsCellItem
						icon={
							<Tooltip title={t('add')}>
								<AddIcon />
							</Tooltip>
						}
						color="success"
						label={t('add')}
						onClick={() => {
							const memberId = params.id.toString();
							updateMemberHandler(
								{
									phaseId: phaseId,
									memberId: memberId,
									operator: 'ADD',
								},
								t('addMemberSuccess'),
								t('addMemberError')
							);
						}}
					/>,
				],
			},
		],
		[phaseId, t, updateMemberHandler]
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
			{
				field: 'actions',
				headerName: t('action'),
				type: 'actions',
				width: 40,
				getActions: (params) => [
					<GridActionsCellItem
						icon={
							<Tooltip title={t('delete')}>
								<DeleteIcon />
							</Tooltip>
						}
						color="error"
						label={t('delete')}
						onClick={() => {
							const memberId = params.id.toString();
							updateMemberHandler(
								{
									phaseId: phaseId,
									memberId: memberId,
									operator: 'REMOVE',
								},
								t('removeMemberSuccess'),
								t('removeMemberError')
							);
						}}
					/>,
				],
			},
		],
		[phaseId, t, updateMemberHandler]
	);

	if (userQuery.isLoading || membersQuery.isLoading) return <LinearProgress />;
	return (
		<>
			{isUpdatingMember && <LinearProgress />}
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
		</>
	);
}
