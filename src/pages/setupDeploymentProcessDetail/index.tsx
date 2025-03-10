import {
	Typography,
	TableCell,
	TableRow,
	Stack,
	Box,
	Tab,
	Tabs,
	Select,
	MenuItem,
	FormControl,
	CircularProgress,
	LinearProgress,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationTable, TabPanel } from '../../components';
import { useParams } from 'react-router-dom';
import { HideDuration, PathHolders } from '../../utils';
import {
	useGetAllUsersByRole,
	useGetDeploymentProcess,
	useGetDeploymentProcessMemberIds,
	useUpdateDeploymentProcess,
	useUpdateDeploymentProcessMember,
} from '../../services';
import { useNotifications } from '@toolpad/core';
import { t } from 'i18next';
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

const deploymentData = {
	customer: 'Oliver Hansen',
	software: 'Oliver Hansen',
	version: '1.0',
	status: 'Đang triển khai',
	startDate: '00/00/0000',
	endDate: '00/00/0000',
	modules: Array.from({ length: 5 }, (_, i) => ({
		id: i + 1,
		name: `Module ${i + 1}`,
		version: '1.0',
	})),
	phases: [
		{
			id: 1,
			name: 'Nguyễn Văn A',
			email: 'a@gmail.com',
			step: 'Lập kế hoạch',
			updatedAt: '04/03/2019',
		},
		{
			id: 2,
			name: 'Nguyễn Văn B',
			email: 'Đang triển khai',
			step: 'Lập kế hoạch',
			updatedAt: '04/03/2019',
		},
	],
};

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function PhaseTab() {
	return <></>;
}

function ModuleTab() {
	const [, setModuleQuery] = useState<GetAllModuleQuery>({
		softwareVersionId: '',
		moduleName: '',
		pageNumber: 0,
		pageSize: 6,
	});

	return (
		<PaginationTable
			headers={
				<>
					<TableCell key={`moduleName`} align="center">
						{t('moduleName')}
					</TableCell>
					<TableCell key={`version`} align="center">
						{t('version')}
					</TableCell>
				</>
			}
			count={deploymentData.modules.length ?? 0}
			rows={deploymentData.modules ?? []}
			onPageChange={(newPage) =>
				setModuleQuery((prev) => {
					return { ...prev, ...newPage };
				})
			}
			getCell={(row) => (
				<TableRow key={row.id}>
					<TableCell key={`moduleName`} align="center">
						{row.name}
					</TableCell>

					<TableCell key={`version`} align="center">
						{row.version}
					</TableCell>
				</TableRow>
			)}
		/>
	);
}

function PersonnelTab({ processId }: { processId: number }) {
	const userQuery = useGetAllUsersByRole('deployment_person');
	const memberIdQuery = useGetDeploymentProcessMemberIds(processId);
	const [updateMemberTrigger, { isLoading: isUpdatingMember }] =
		useUpdateDeploymentProcessMember();

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
						icon={<AddIcon />}
						color="success"
						label="Add"
						onClick={() => {
							const memberId = params.id.toString();
							updateMemberTrigger({
								processId: processId,
								memberId: memberId,
								operator: 'ADD',
							});
						}}
					/>,
				],
			},
		],
		[processId, updateMemberTrigger]
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
						icon={<DeleteIcon />}
						color="error"
						label="Delete"
						onClick={() => {
							const memberId = params.id.toString();
							updateMemberTrigger({
								processId: processId,
								memberId: memberId,
								operator: 'REMOVE',
							});
						}}
					/>,
				],
			},
		],
		[processId, updateMemberTrigger]
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

const SetupDeploymentProcessPage = () => {
	const { t } = useTranslation();
	const [value, setValue] = React.useState(0);
	const processId = useParams()[PathHolders.DEPLOYMENT_PROCESS_ID];
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
				{t('deploymentProcessInfor')}
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
						<strong>{t('customer')}:</strong>{' '}
						{deploymentProcess.data?.customer.name}
					</Typography>
					<Typography>
						<strong>{t('status')}:</strong>
					</Typography>
					<FormControl>
						<Select
							id="select-deployment-process-status"
							value={deploymentProcess.data?.status}
							defaultValue={'INIT'}
							size="small"
							onChange={(e) => {
								handleUpdateProcess({
									processId: Number(processId),
									status: e.target.value as DeploymentProcessStatus,
								});
							}}
						>
							<MenuItem value={'INIT'}>{t('init')}</MenuItem>
							<MenuItem value={'PENDING'}>{t('pending')}</MenuItem>
							<MenuItem value={'IN_PROGRESS'}>{t('inProgress')}</MenuItem>
							<MenuItem value={'DONE'}>{t('done')}</MenuItem>
						</Select>
					</FormControl>
				</Stack>
				<Stack spacing={1}>
					<Typography>
						<strong>{t('software')}:</strong>{' '}
						{deploymentProcess.data?.software.name}
					</Typography>
					<Typography>
						<strong>{t('version')}:</strong>{' '}
						{deploymentProcess.data?.software.version}
					</Typography>
					{isProcessUpdating && (
						<Stack direction={'row'} spacing={1}>
							<CircularProgress size={30} />
							<Typography variant="subtitle1">{t('loading')}</Typography>
						</Stack>
					)}
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
					<Tab label={t('phases')} {...a11yProps(0)} />
					<Tab label={t('moduleList')} {...a11yProps(1)} />
					<Tab label={t('personnelPerforms')} {...a11yProps(2)} />
				</Tabs>
				<TabPanel value={value} index={0}>
					<PhaseTab />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<ModuleTab />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<PersonnelTab processId={Number(processId)} />
				</TabPanel>
			</Box>
		</Box>
	);
};

export default SetupDeploymentProcessPage;
