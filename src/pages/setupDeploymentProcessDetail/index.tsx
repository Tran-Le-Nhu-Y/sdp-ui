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
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Tooltip,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationTable, TabPanel } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import {
	HideDuration,
	isValidLength,
	convertToAPIDateFormat,
	parseToDayjs,
	PathHolders,
	RoutePaths,
	TextLength,
} from '../../utils';
import {
	useCreateDeploymentPhase,
	useDeleteDeploymentPhase,
	useGetAllDeploymentPhasesByProcessId,
	useGetAllDeploymentPhaseTypesByUserId,
	useGetAllUsersByRole,
	useGetDeploymentProcess,
	useGetDeploymentProcessMemberIds,
	useUpdateDeploymentProcess,
	useUpdateDeploymentProcessMember,
} from '../../services';
import { useNotifications, useSession } from '@toolpad/core';
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
import EditIcon from '@mui/icons-material/Edit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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

function AddPhaseDialog({
	processId,
	open,
	onClose,
}: {
	processId: number;
	open: boolean;
	onClose: () => void;
}) {
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const userId = useSession()?.user?.id ?? '';

	const [phaseTypeQueryReq, setPhaseTypeQueryReq] =
		useState<GetAllDeploymentPhaseTypeQuery>({
			userId: userId,
			pageNumber: 0,
			pageSize: 5,
		});
	const phaseTypeQuery =
		useGetAllDeploymentPhaseTypesByUserId(phaseTypeQueryReq);
	useEffect(() => {
		if (phaseTypeQuery.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, phaseTypeQuery.isError, t]);
	const phaseTypeCols: GridColDef[] = useMemo(
		() => [
			{
				field: 'name',
				headerName: t('deploymentPhaseType'),
				editable: false,
				type: 'string',
				width: 150,
			},
		],
		[t]
	);

	const [createProps, setCreateProps] = useState<
		Partial<Omit<DeploymentPhaseCreateRequest, 'processId'>>
	>({ numOrder: 0 });
	const [createPhaseTrigger, { isLoading: isPhaseCreating }] =
		useCreateDeploymentPhase();
	const addPhaseHandler = async () => {
		try {
			await createPhaseTrigger({
				processId,
				typeId: createProps.typeId!,
				numOrder: createProps.numOrder!,
				plannedStartDate: createProps.plannedStartDate!,
				plannedEndDate: createProps.plannedEndDate!,
			}).unwrap();

			notifications.show(t('addPhaseSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
			setCreateProps({ numOrder: 0 });
		} catch (error) {
			console.error(error);
			notifications.show(t('addPhaseError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		} finally {
			onClose();
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{t('addPhase')}</DialogTitle>
			<DialogContent>
				<Stack direction={'column'} spacing={2}>
					<TextField
						required
						id="num-order"
						name="numOrder"
						label={t('numOrder')}
						fullWidth
						type="number"
						variant="standard"
						value={createProps?.numOrder ?? 0}
						onChange={(e) => {
							const numOrder = Number(e.currentTarget.value);
							if (
								!Number.isSafeInteger(numOrder) ||
								numOrder < 0 ||
								numOrder > 100
							)
								return;

							setCreateProps((pre) => ({ ...pre, numOrder: numOrder }));
						}}
					/>
					<TextField
						margin="dense"
						id="description"
						name="description"
						value={createProps?.description}
						label={t('description')}
						fullWidth
						variant="standard"
						multiline
						onChange={(e) => {
							const value = e.currentTarget.value;
							if (isValidLength(value, TextLength.VeryLong))
								setCreateProps((pre) => ({ ...pre, description: value }));
						}}
					/>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<DataGrid
							checkboxSelection
							disableMultipleRowSelection
							onRowSelectionModelChange={(model) => {
								if (model.length > 0)
									setCreateProps((pre) => ({
										...pre,
										typeId: model[0].toString(),
									}));
								else
									setCreateProps((pre) => ({
										...pre,
										typeId: undefined,
									}));
							}}
							rows={phaseTypeQuery.data?.content}
							rowCount={phaseTypeQuery.data?.totalElements}
							paginationMode="server"
							paginationModel={{
								page: phaseTypeQueryReq.pageNumber ?? 0,
								pageSize: phaseTypeQueryReq.pageSize ?? 5,
							}}
							onPaginationModelChange={(model) => {
								setPhaseTypeQueryReq((pre) => ({
									...pre,
									pageNumber: model.page,
									pageSize: model.pageSize,
								}));
							}}
							columns={phaseTypeCols}
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
					<DatePicker
						label={t('plannedStartDate')}
						maxDate={
							createProps.plannedEndDate
								? parseToDayjs(createProps.plannedEndDate)
								: undefined
						}
						onChange={(value) => {
							if (!value) return;
							const date = convertToAPIDateFormat(value);
							setCreateProps((pre) => ({ ...pre, plannedStartDate: date }));
						}}
					/>
					<DatePicker
						label={t('plannedEndDate')}
						minDate={
							createProps.plannedStartDate
								? parseToDayjs(createProps.plannedStartDate)
								: undefined
						}
						onChange={(value) => {
							if (!value) return;
							const date = convertToAPIDateFormat(value);
							setCreateProps((pre) => ({ ...pre, plannedEndDate: date }));
						}}
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>{t('cancel')}</Button>
				<Button
					disabled={
						createProps.typeId === undefined ||
						createProps.plannedStartDate === undefined ||
						createProps.plannedEndDate === undefined
					}
					loading={isPhaseCreating}
					loadingPosition="start"
					onClick={addPhaseHandler}
				>
					{t('add')}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function PhaseTab({ processId }: { processId: number }) {
	const { t } = useTranslation('standard');
	const navigate = useNavigate();
	const notifications = useNotifications();
	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const phaseQuery = useGetAllDeploymentPhasesByProcessId({
		processId: processId,
	});

	const [deletePhaseTrigger, { isLoading: isPhaseDeleting }] =
		useDeleteDeploymentPhase();

	const cols: GridColDef[] = useMemo(
		() => [
			{
				field: 'numOrder',
				headerName: t('numOrder'),
				editable: false,
				width: 120,
				type: 'number',
			},
			{
				field: 'phaseType',
				editable: false,
				minWidth: 200,
				headerName: t('deploymentPhaseType'),
				type: 'string',
				valueGetter: (_value, row) => {
					return row.type.name;
				},
			},
			{
				field: 'plannedStartDate',
				align: 'center',
				editable: false,
				minWidth: 200,
				headerName: t('plannedStartDate'),
				headerAlign: 'center',
				type: 'date',
				valueGetter: (_value, row) => {
					return new Date(row.plannedStartDate);
				},
			},
			{
				field: 'plannedEndDate',
				align: 'center',
				editable: false,
				minWidth: 200,
				headerName: t('plannedEndDate'),
				headerAlign: 'center',
				type: 'date',
				valueGetter: (_value, row) => {
					return new Date(row.plannedEndDate);
				},
			},
			{
				field: 'actions',
				headerName: t('action'),
				type: 'actions',
				width: 100,
				getActions: (params) => [
					<GridActionsCellItem
						icon={
							<Tooltip title={t('edit')}>
								<EditIcon />
							</Tooltip>
						}
						label={t('edit')}
						onClick={() => {
							const phaseId = params.id.toString();
							const path = RoutePaths.SETUP_DEPLOYMENT_PHASE.replace(
								`:${PathHolders.DEPLOYMENT_PROCESS_ID}`,
								`${processId}`
							).replace(`:${PathHolders.DEPLOYMENT_PHASE_ID}`, phaseId);
							navigate(path);
						}}
					/>,
					<GridActionsCellItem
						icon={
							<Tooltip title={t('delete')}>
								<DeleteIcon />
							</Tooltip>
						}
						color="error"
						label={t('delete')}
						onClick={async () => {
							const phaseId = params.id.toString();
							try {
								await deletePhaseTrigger(phaseId).unwrap();

								notifications.show(t('deletePhaseSuccess'), {
									severity: 'success',
									autoHideDuration: HideDuration.fast,
								});
							} catch (error) {
								console.error(error);
								notifications.show(t('deletePhaseError'), {
									severity: 'error',
									autoHideDuration: HideDuration.fast,
								});
							}
						}}
					/>,
				],
			},
		],
		[deletePhaseTrigger, navigate, notifications, processId, t]
	);

	return (
		<>
			<AddPhaseDialog
				open={openCreateDialog}
				processId={processId}
				onClose={() => {
					setOpenCreateDialog(false);
				}}
			/>
			<Stack direction={'column'} spacing={1}>
				<Button
					color="primary"
					variant="contained"
					sx={{
						alignSelf: 'flex-end',
						width: 'fit-content',
					}}
					onClick={() => setOpenCreateDialog(true)}
				>
					{t('addPhase')}
				</Button>

				{isPhaseDeleting && <LinearProgress />}

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
						rows={phaseQuery.data}
						columns={cols}
						pageSizeOptions={[5, 10, 15]}
						initialState={{
							pagination: {
								paginationModel: {
									page: 0,
									pageSize: 5,
								},
							},
							sorting: {
								sortModel: [{ field: 'numOrder', sort: 'asc' }],
							},
						}}
					/>
				</div>
			</Stack>
		</>
	);
}

function ModuleTab() {
	const { t } = useTranslation('standard');
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
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const userQuery = useGetAllUsersByRole('deployment_person');
	const memberIdQuery = useGetDeploymentProcessMemberIds(processId);
	const [updateMemberTrigger, { isLoading: isUpdatingMember }] =
		useUpdateDeploymentProcessMember();

	const updateMemberHandler = useCallback(
		async (
			request: DeploymentProcessMemberUpdateRequest,
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
									processId: processId,
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
		[processId, t, updateMemberHandler]
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
									processId: processId,
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
		[processId, t, updateMemberHandler]
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
	const { t } = useTranslation('standard');
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
							value={deploymentProcess.data?.status ?? 'INIT'}
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
					<PhaseTab processId={Number(processId)} />
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
