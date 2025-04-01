import {
	Typography,
	TableCell,
	TableRow,
	Container,
	Paper,
	Stack,
	Box,
	Tab,
	Tabs,
	Button,
	Step,
	StepContent,
	Stepper,
	StepButton,
	LinearProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from '@mui/material';
import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomDataGrid, PaginationTable } from '../../components';
import { useParams } from 'react-router-dom';
import {
	getDeploymentProcessStatusTransKey,
	HideDuration,
	PathHolders,
} from '../../utils';
import {
	useGetAllModulesInProcess,
	useGetAllUsersByRole,
	useGetDeploymentPhaseMemberIds,
	useGetDeploymentProcess,
	useGetDeploymentProcessMemberIds,
	useUpdateDeploymentPhaseActualDates,
} from '../../services';
import { useNotifications, useSession } from '@toolpad/core';
import {
	GridColDef,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useGetAllPhasesByProcessIdQuery } from '../../services/deployment-phase';

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
	personnel: Array.from({ length: 5 }, (_, i) => ({
		id: i + 1,
		name: `Nhân sự ${i + 1}`,
		phone: '0123456789',
		email: 'abc@gmail.com',
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

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function VerticalLinearStepper({ phases }: { phases: DeploymentPhase[] }) {
	//const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const userId = useSession()?.user?.id ?? '';
	const [activeStep, setActiveStep] = React.useState(0);
	const [updatedPhases, setUpdatedPhases] = useState(phases);
	const [updateActualDateTrigger, { isLoading: isUpdatingActualDate }] =
		useUpdateDeploymentPhaseActualDates();
	const [openDialog, setOpenDialog] = useState(false);
	const [showCopyrightButton, setShowCopyrightButton] = useState(false);
	const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
	const [, setUploadedFile] = useState<File | null>(null);

	const userQuery = useGetAllUsersByRole('deployment_person');
	const memberIdQuery = useGetDeploymentPhaseMemberIds(selectedPhaseId ?? '');

	useEffect(() => {
		setUpdatedPhases(phases);
	}, [phases]);

	useEffect(() => {
		setShowCopyrightButton(
			activeStep === updatedPhases.length && updatedPhases.length > 0,
		);
	}, [activeStep, updatedPhases]);

	const updateActualHandler = useCallback(
		async (
			request: DeploymentPhaseUpdateActualDatesRequest,
			successText: string,
			errorText: string,
		) => {
			try {
				await updateActualDateTrigger(request).unwrap();

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
		[notifications, updateActualDateTrigger],
	);

	// const [attachments, setAttachments] = useState<Record<number, File | null>>(
	// 	{},
	// );

	// const handleFileUpload = (
	// 	event: React.ChangeEvent<HTMLInputElement>,
	// 	phaseId: number,
	// ) => {
	// 	if (event.target.files && event.target.files.length > 0) {
	// 		setAttachments((prev) => ({
	// 			...prev,
	// 			[phaseId]: event.target.files[0],
	// 		}));
	// 	}
	// };

	const handleStart = async (phaseId: string) => {
		const currentTime = new Date().toISOString();
		if (!userId) {
			notifications.show('Lỗi: Không tìm thấy userId!', { severity: 'error' });
			return;
		}
		console.log('Payload gửi đi:', {
			phaseId,
			description: 'Bắt đầu thực hiện',
			actualEndDate: currentTime,
			updatedByUserId: userId,
		});
		setUpdatedPhases((prevPhases) =>
			prevPhases.map((phase) =>
				phase.id === phaseId
					? { ...phase, actualStartDate: currentTime }
					: phase,
			),
		);
		await updateActualHandler(
			{
				phaseId: phaseId,
				description: 'Bắt đầu thực hiện',
				actualStartDate: currentTime,
				actualEndDate: null,
				updatedByUserId: userId,
			},
			'Cập nhật ngày bắt đầu thực tế thành công!',
			'Lỗi khi cập nhật ngày bắt đầu thực tế!',
		);
	};

	const handleComplete = async () => {
		if (!selectedPhaseId) return;
		const currentTime = new Date().toISOString();
		if (!userId) {
			notifications.show('Lỗi: Không tìm thấy userId!', { severity: 'error' });
			return;
		}

		const currentPhase = phases.find((phase) => phase.id === selectedPhaseId);
		const actualStartDate = currentPhase?.actualStartDate ?? null;
		setUpdatedPhases((prevPhases) =>
			prevPhases.map((phase) =>
				phase.id === selectedPhaseId
					? { ...phase, actualEndDate: currentTime }
					: phase,
			),
		);

		await updateActualHandler(
			{
				phaseId: selectedPhaseId,
				description: 'Hoàn thành giai đoạn',
				actualStartDate: actualStartDate,
				actualEndDate: currentTime,
				updatedByUserId: userId,
			},
			'Cập nhật ngày kết thúc thực tế thành công!',
			'Lỗi khi cập nhật ngày kết thúc thực tế!',
		);
		setOpenDialog(false);
		setSelectedPhaseId(null);
	};

	const handleConfirm = (phaseId: string) => {
		setSelectedPhaseId(phaseId);
		setOpenDialog(true);
	};
	const handleCancelComplete = () => {
		setOpenDialog(false);
		setSelectedPhaseId(null);
	};
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setUploadedFile(event.target.files[0]);
		}
	};

	const handleCreateCopyright = () => {
		// Handle the creation of copyright logic here
		console.log('Creating copyright...');
	};

	// const handleNext = () => {
	// 	setActiveStep((prevActiveStep) => prevActiveStep + 1);
	// };

	// const handleBack = () => {
	// 	setActiveStep((prevActiveStep) => prevActiveStep - 1);
	// };

	const handleReset = () => {
		setActiveStep(0);
		setUpdatedPhases(phases);
	};

	return (
		<Box
			sx={{
				width: '100%',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'justify',
				display: 'flex',
			}}
		>
			{isUpdatingActualDate && <LinearProgress />}
			<Stepper nonLinear activeStep={activeStep} orientation="vertical">
				{updatedPhases.map((phase, index) => (
					<Step key={phase.id} completed={activeStep > index}>
						<StepButton
							color="inherit"
							onClick={() => {
								setSelectedPhaseId(phase.id);
								setActiveStep(index);
							}}
						>
							{phase.type.name}
						</StepButton>
						<StepContent>
							<Stack direction={'column'} spacing={2} mb={2}>
								<Typography>{phase.description}</Typography>
								{/* {selectedPhaseId === phase.id && (
									<>
										{userDetails.isLoading && (
											<Typography>Đang tải...</Typography>
										)}
										{userDetails.isError && (
											<Typography>Lỗi tải dữ liệu.</Typography>
										)}
										{userDetails.data && (
											<Typography>
												<strong>Nhân sự thực hiện:</strong>{' '}
												{userDetails.data
													.map((user) => `${user.name} (${user.email})`)
													.join(', ')}
											</Typography>
										)}
									</>
								)} */}
								<Typography>
									<strong>Nhân sự thực hiện:</strong> {userQuery.data?.length}{' '}
									{userQuery.data?.length === 1 ? 'người' : 'người'}
									{memberIdQuery.isLoading && (
										<Typography>Đang tải...</Typography>
									)}
								</Typography>
								<Typography>
									<strong>Ngày bắt đầu dự kiến:</strong>{' '}
									{phase.plannedStartDate}
								</Typography>
								<Typography>
									<strong>Ngày kết thúc dự kiến:</strong> {phase.plannedEndDate}
								</Typography>
								<Typography>
									<strong>Ngày bắt đầu thực tế:</strong>{' '}
									{phase.actualStartDate || 'Chưa bắt đầu'}
								</Typography>
								<Typography>
									<strong>Ngày kết thúc thực tế:</strong>{' '}
									{phase.actualEndDate || 'Chưa hoàn thành'}
								</Typography>
							</Stack>

							<Box sx={{ mb: 2 }}>
								<Button
									variant="contained"
									onClick={() => handleStart(phase.id)}
									sx={{ mt: 1, mr: 1 }}
									// disabled={!!phase.actualStartDate}
								>
									Bắt đầu thực hiện
								</Button>
								<Button
									variant="contained"
									onClick={() => handleConfirm(phase.id)}
									sx={{ mt: 1, mr: 1 }}
									// disabled={!phase.actualStartDate || !!phase.actualEndDate}
								>
									Hoàn thành
								</Button>
							</Box>
						</StepContent>
					</Step>
				))}
			</Stepper>
			{activeStep === updatedPhases.length && (
				<Paper square elevation={0} sx={{ p: 3 }}>
					<Typography>All steps completed - you&apos;re finished</Typography>
					<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
						Reset
					</Button>
				</Paper>
			)}
			<Dialog open={openDialog} onClose={handleCancelComplete}>
				<DialogTitle>Xác nhận hoàn thành giai đoạn</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Bạn có chắc chắn muốn hoàn thành giai đoạn này?
					</DialogContentText>
					<TextField
						type="file"
						fullWidth
						margin="normal"
						onChange={handleFileUpload}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelComplete} color="primary">
						Hủy
					</Button>
					<Button onClick={handleComplete} color="primary" autoFocus>
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>
			{showCopyrightButton && (
				<Button onClick={handleCreateCopyright} sx={{ mt: 2 }}>
					Tạo bản quyền
				</Button>
			)}
		</Box>
	);
}

const DeploymentProcessDetailPage = () => {
	const { t } = useTranslation();
	const [value, setValue] = React.useState(0);
	const notifications = useNotifications();
	const processId = useParams()[PathHolders.DEPLOYMENT_PROCESS_ID];
	const numericProcessId = processId ? Number(processId) : undefined;

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

	const phasesQuery = useGetAllPhasesByProcessIdQuery(
		{ processId: numericProcessId || 0 },
		{
			skip: !numericProcessId,
		},
	);
	useEffect(() => {
		if (phasesQuery.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, phasesQuery.isError, t]);

	const phases = useMemo(() => {
		return phasesQuery.data?.map((phase) => ({
			...phase,
			plannedStartDate: phase.plannedStartDate,
			plannedEndDate: phase.plannedEndDate,
			actualStartDate: phase.actualStartDate,
			actualEndDate: phase.actualEndDate,
		}));
	}, [phasesQuery.data]);

	const [, setModuleQuery] = useState<GetAllModuleQuery>({
		softwareVersionId: '',
		moduleName: '',
		pageNumber: 0,
		pageSize: 6,
	});

	return (
		<Container>
			<Typography variant="h5" align="center" gutterBottom>
				<strong>{t('deploymentProcessInfor')}</strong>
			</Typography>
			<Stack direction={'row'} justifyContent={'space-between'}>
				<Stack>
					<Typography>
						<strong>{t('customer')}:</strong>{' '}
						{deploymentProcess.data?.customer.name}
					</Typography>
					<Typography>
						<strong>{t('status')}:</strong>{' '}
						{deploymentProcess.data?.status &&
							t(
								getDeploymentProcessStatusTransKey(
									deploymentProcess.data?.status,
								),
							)}
					</Typography>
				</Stack>
				<Stack>
					<Typography>
						<strong>{t('software')}:</strong>{' '}
						{deploymentProcess.data?.software.name}
					</Typography>
					<Typography>
						<strong>{t('version')}:</strong>{' '}
						{deploymentProcess.data?.software.version}
					</Typography>
				</Stack>
				<Stack>
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

			<Box sx={{ width: '100%' }}>
				<Box
					sx={{
						borderBottom: 1,
						borderColor: 'divider',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="basic tabs example "
					>
						<Tab label={t('currentStep')} {...a11yProps(0)} />
						<Tab label={t('moduleList')} {...a11yProps(1)} />
						<Tab label={t('personnelList')} {...a11yProps(2)} />
					</Tabs>
				</Box>
				<CustomTabPanel value={value} index={0}>
					<VerticalLinearStepper phases={phases ?? []} />
				</CustomTabPanel>
				<CustomTabPanel value={value} index={1}>
					<ModuleTab processId={Number(processId)} />
				</CustomTabPanel>
				<CustomTabPanel value={value} index={2}>
					<PersonnelTab processId={Number(processId)} />
				</CustomTabPanel>
			</Box>

			<Typography variant="h6" gutterBottom>
				{t('progressUpdateHistory')}
			</Typography>
			<PaginationTable
				headers={
					<>
						<TableCell key={`deployer`} align="center">
							{t('deployer')}
						</TableCell>

						<TableCell key={`email`} align="center">
							{t('email')}
						</TableCell>
						<TableCell key={`process`} align="center">
							{t('process')}
						</TableCell>
						<TableCell key={`updatedDate`} align="center">
							{t('updatedDate')}
						</TableCell>
					</>
				}
				count={deploymentData.phases.length ?? 0}
				rows={deploymentData.phases ?? []}
				onPageChange={(newPage) =>
					setModuleQuery((prev) => {
						return { ...prev, ...newPage };
					})
				}
				getCell={(row) => (
					<TableRow key={row.id}>
						<TableCell key={`deployer`} align="center">
							{row.name}
						</TableCell>

						<TableCell key={`email`} align="center">
							{row.email}
						</TableCell>
						<TableCell key={`process`} align="center">
							{row.step}
						</TableCell>
						<TableCell key={`updatedDate`} align="center">
							{row.updatedAt}
						</TableCell>
					</TableRow>
				)}
			/>
		</Container>
	);
};

function ModuleTab({ processId }: { processId: number }) {
	const { t } = useTranslation('standard');
	const modulesQuery = useGetAllModulesInProcess(processId);

	const cols: GridColDef[] = useMemo(
		() => [
			{
				field: 'moduleName',
				editable: false,
				minWidth: 300,
				headerName: t('moduleName'),
				type: 'string',
				valueGetter: (_value, row) => {
					return row.module.name;
				},
				flex: 1,
			},
			{
				field: 'versionName',
				editable: false,
				minWidth: 200,
				headerName: t('version'),
				type: 'string',
				valueGetter: (_value, row) => {
					return row.version.name;
				},
				flex: 1,
			},
		],
		[t],
	);

	return (
		<CustomDataGrid
			slots={{
				toolbar: () => (
					<GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
						<GridToolbarFilterButton />
						<GridToolbarDensitySelector />
						<GridToolbarColumnsButton />
						<GridToolbarQuickFilter />
					</GridToolbarContainer>
				),
			}}
			rows={modulesQuery.data}
			columns={cols}
			pageSizeOptions={[5, 10, 15]}
			getRowId={(row) => row.version.id}
			initialState={{
				pagination: {
					paginationModel: {
						page: 0,
						pageSize: 5,
					},
				},
				sorting: {
					sortModel: [{ field: 'moduleName', sort: 'asc' }],
				},
			}}
		/>
	);
}

function PersonnelTab({ processId }: { processId: number }) {
	const { t } = useTranslation('standard');
	const userQuery = useGetAllUsersByRole('deployment_person');
	const memberIdQuery = useGetDeploymentProcessMemberIds(processId);

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
		[memberIdQuery?.data, userQuery?.data],
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
		[t],
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
		[t],
	);

	if (userQuery.isLoading || memberIdQuery.isLoading) return <LinearProgress />;
	return (
		<>
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
		</>
	);
}

export default DeploymentProcessDetailPage;
