import {
	Typography,
	Stack,
	Box,
	Tab,
	Tabs,
	LinearProgress,
	Tooltip,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabPanel } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { HideDuration, PathHolders } from '../../utils';
import {
	useGetAllUsersByRole,
	useGetDeploymentProcess,
	useGetDeploymentPhaseMemberIds,
	useUpdateDeploymentProcess,
	useUpdateDeploymentPhaseMember,
} from '../../services';
import { useNotifications } from '@toolpad/core';
import {
	DataGrid,
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

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function DetailTab({ processId }: { processId: number }) {
	const { t } = useTranslation('standard');
	const navigate = useNavigate();
	const notifications = useNotifications();
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	return <></>;
}

function PersonnelTab({ phaseId }: { phaseId: string }) {
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const userQuery = useGetAllUsersByRole('deployment_person');
	const memberIdQuery = useGetDeploymentPhaseMemberIds(phaseId);
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

	if (userQuery.isLoading || memberIdQuery.isLoading) return <LinearProgress />;
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
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<DataGrid
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
					</div>
				</Stack>
				<Stack direction={'column'} spacing={1}>
					<Typography variant="h6">{t('assignedPersonnel')}</Typography>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<DataGrid
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
					</div>
				</Stack>
			</Stack>
		</>
	);
}

const SetupDeploymentPhasePage = () => {
	const { t } = useTranslation('standard');
	const [value, setValue] = React.useState(0);
	const processId = useParams()[PathHolders.DEPLOYMENT_PROCESS_ID];
	const phaseId = useParams()[PathHolders.DEPLOYMENT_PHASE_ID] ?? '';
	const notifications = useNotifications();

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const deploymentProcess = useGetDeploymentProcess(processId!, {
		skip: !processId,
	});
	useEffect(() => {
		if (deploymentProcess.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, deploymentProcess.isError, t]);

	const [updateProcessTrigger, { isLoading: isProcessUpdating }] =
		useUpdateDeploymentProcess();
	const handleUpdateProcess = async (data: DeploymentProcessUpdateRequest) => {
		try {
			await updateProcessTrigger(data).unwrap();

			notifications.show(t('updateDeploymentProcessSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateDeploymentProcessError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	return (
		<Box>
			<Typography variant="h4" align="center" gutterBottom>
				{'Thong tin giai doan trien khai'}
			</Typography>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={{
					xs: 2,
					sm: 2,
					md: 0,
				}}
				justifyContent={{
					xs: 'normal',
					sm: 'space-between',
				}}
			>
				<Stack spacing={1}>
					<Typography>
						<strong>{t('software')}:</strong>{' '}
						{deploymentProcess.data?.software.name}
					</Typography>
					<Typography>
						<strong>{t('version')}:</strong>{' '}
						{deploymentProcess.data?.software.version}
					</Typography>
					<Typography>
						<strong>{t('customer')}:</strong>{' '}
						{deploymentProcess.data?.customer.name}
					</Typography>
				</Stack>
				<Stack spacing={1}>
					<Typography>
						<strong>Thu tu:</strong> {deploymentProcess.data?.customer.name}
					</Typography>
					<Typography>
						<strong>Giai doan:</strong> {deploymentProcess.data?.customer.name}
					</Typography>
					<Typography>
						<strong>Dang giai doan:</strong>{' '}
						{deploymentProcess.data?.customer.name}
					</Typography>
				</Stack>
				<Stack spacing={1}>
					<Typography>
						<strong>{t('dateCreated')}:</strong>{' '}
						{deploymentProcess.data?.createdAt}
					</Typography>
					<Typography>
						<strong>{t('lastUpdated')}:</strong>{' '}
						{deploymentProcess.data?.updatedAt}
					</Typography>
				</Stack>
			</Stack>

			<Box>
				<Tabs
					sx={{
						borderBottom: 1,
						borderColor: 'divider',
					}}
					value={value}
					onChange={handleChange}
					variant={'fullWidth'}
				>
					<Tab label={'Chi tiet'} {...a11yProps(0)} />
					<Tab label={t('personnelPerforms')} {...a11yProps(1)} />
				</Tabs>
				<TabPanel value={value} index={0}>
					<DetailTab processId={Number(processId)} />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<PersonnelTab phaseId={phaseId} />
				</TabPanel>
			</Box>
		</Box>
	);
};

export default SetupDeploymentPhasePage;
