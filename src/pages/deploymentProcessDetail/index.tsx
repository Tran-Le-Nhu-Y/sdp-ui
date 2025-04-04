import {
	Typography,
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
	DialogTitle,
	TextField,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	AttachmentList,
	CustomDataGrid,
	DragAndDropForm,
	Guard,
} from '../../components';
import { useParams } from 'react-router-dom';
import {
	convertToAPIDateFormat,
	getDeploymentProcessStatusTransKey,
	HideDuration,
	isValidLength,
	parseToDayjs,
	PathHolders,
	TextLength,
} from '../../utils';
import {
	useCreateFile,
	useCreateSoftwareLicense,
	useGetAllLicensesByProcessId,
	useGetAllModulesInProcess,
	useGetAllPhaseAttachments,
	useGetAllUsersByRole,
	useGetDeploymentPhaseMembers,
	useGetDeploymentPhaseUpdateHistories,
	useGetDeploymentProcess,
	useGetDeploymentProcessMemberIds,
	useUpdateDeploymentPhaseActualDates,
	useUpdateDeploymentPhaseAttachment,
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
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

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

function PhaseTab({
	processId,
	phases,
}: {
	processId: number;
	phases: DeploymentPhase[];
}) {
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const userId = useSession()?.user?.id ?? '';
	const [activeStep, setActiveStep] = React.useState(0);
	const [loading, setLoading] = useState(false);
	const [updateActualDateTrigger, { isLoading: isUpdatingActualDate }] =
		useUpdateDeploymentPhaseActualDates();
	const [openDialog, setOpenDialog] = useState(false);
	const showCopyrightButton = useMemo(
		() => phases.every((phase) => phase.isDone),
		[phases],
	);
	const [showLicenseDialog, setShowLicenseDialog] = useState(false);
	const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
	const [description, setDescripton] = useState<string | null>(null);

	const membersQuery = useGetDeploymentPhaseMembers(selectedPhaseId!, {
		skip: !selectedPhaseId,
	});

	useEffect(() => {
		setSelectedPhaseId(phases[activeStep]?.id);
	}, [activeStep, phases]);

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

	const handleStart = async (phaseId: string) => {
		const currentTime = convertToAPIDateFormat(dayjs());
		if (!userId) {
			notifications.show(t('userIdNotFound'), { severity: 'error' });
			return;
		}

		await updateActualHandler(
			{
				phaseId: phaseId,
				description: description,
				actualStartDate: currentTime,
				actualEndDate: null,
				updatedByUserId: userId,
			},
			t('updateDeploymentPhaseActualStartDateSuccess'),
			t('updateDeploymentPhaseActualStartDateError'),
		);
	};

	const handleComplete = (phaseId: string) => {
		setSelectedPhaseId(phaseId);
		setOpenDialog(true);
	};

	const attachments = useGetAllPhaseAttachments(selectedPhaseId!, {
		skip: !selectedPhaseId,
	});
	const [addedFiles, setAddedFiles] = useState<File[]>([]);
	const [updateAttachmentTrigger] = useUpdateDeploymentPhaseAttachment();
	const [uploadFileTrigger] = useCreateFile();

	const handleFileSubmit = async () => {
		if (!selectedPhaseId) return false;

		if (addedFiles.length > 0) {
			try {
				const fileIds = await Promise.all(
					addedFiles.map((file) => {
						return uploadFileTrigger({ userId, file }).unwrap();
					}),
				);
				await Promise.all(
					fileIds.map((fileId) =>
						updateAttachmentTrigger({
							phaseId: selectedPhaseId,
							attachmentId: fileId,
							operator: 'ADD',
						}).unwrap(),
					),
				);
			} catch (error) {
				notifications.show(t('uploadedFileError'), {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
				console.log(error);
				return false;
			}
		}

		return true;
	};

	const handleConfirm = async () => {
		if (!selectedPhaseId) return;
		if (!userId) {
			notifications.show(t('userIdNotFound'), { severity: 'error' });
			return;
		}

		setLoading(true);

		const currentTime = convertToAPIDateFormat(dayjs());

		const currentPhase = phases.find((phase) => phase.id === selectedPhaseId);
		const actualStartDate = currentPhase?.actualStartDate ?? null;

		await updateActualHandler(
			{
				phaseId: selectedPhaseId,
				description: description,
				actualStartDate: actualStartDate,
				actualEndDate: currentTime,
				updatedByUserId: userId,
			},
			t('updateDeploymentPhaseActualEndDateSuccess'),
			t('updateDeploymentPhaseActualEndDateError'),
		);

		phaseUpdateHistories.refetch();

		const handleFileResult = await handleFileSubmit();
		if (!handleFileResult) {
			setAddedFiles([]);
			setLoading(false);
			return;
		}

		setLoading(false);
		setOpenDialog(false);
	};

	const handleCancelConfirm = () => {
		setOpenDialog(false);
	};

	const [createLicenseTrigger] = useCreateSoftwareLicense();
	const [licenseCreating, setLicenseCreating] = useState<
		Partial<Omit<SoftwareLicenseCreateRequest, 'userId' | 'processId'>>
	>({});

	const handleCreateLicense = async () => {
		const validate = () => {
			if (!licenseCreating.startTimeMs) {
				notifications.show(t('licenseStartTimeRequire'), {
					severity: 'warning',
					autoHideDuration: HideDuration.fast,
				});
				return false;
			}
			if (!licenseCreating.endTimeMs) {
				notifications.show(t('licenseEndTimeRequire'), {
					severity: 'warning',
					autoHideDuration: HideDuration.fast,
				});
				return false;
			}
			if (!licenseCreating.expireAlertIntervalDay) {
				notifications.show(t('expireAlertIntervalDayRequire'), {
					severity: 'warning',
					autoHideDuration: HideDuration.fast,
				});
				return false;
			}

			return true;
		};
		if (!validate()) return;

		try {
			await createLicenseTrigger({
				userId: userId,
				processId: processId,
				description: licenseCreating.description,
				startTimeMs: licenseCreating.startTimeMs!,
				endTimeMs: licenseCreating.endTimeMs!,
				expireAlertIntervalDay: licenseCreating.expireAlertIntervalDay!,
			});
			notifications.show(t('createLicenseSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
			setShowLicenseDialog(false);
		} catch (error) {
			notifications.show(t('createLicenseError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	const memberCols: GridColDef<UserMetadata>[] = useMemo(
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

	const [phaseUpdateHistoriesQuery, setPhaseUpdateHistoriesQuery] =
		useState<GetAllDeploymentPhaseUpdateHistoriesQuery>({
			processId: 1,
			pageNumber: 0,
			pageSize: 5,
		});
	const phaseUpdateHistories = useGetDeploymentPhaseUpdateHistories(
		phaseUpdateHistoriesQuery,
	);
	const historyCols: GridColDef<DeploymentPhaseUpdateHistory>[] = useMemo(
		() => [
			{
				field: 'phaseType',
				editable: false,
				sortable: false,
				minWidth: 200,
				headerName: t('phase'),
				type: 'string',
				valueGetter: (_value, row) => {
					return row.phase.type.name;
				},
			},
			{
				field: 'description',
				headerName: t('description'),
				editable: false,
				sortable: false,

				width: 250,
				type: 'string',
				valueGetter: (_value, row) => {
					return row.description ?? '';
				},
			},
			{
				field: 'updater',
				headerName: t('updater'),
				editable: false,
				sortable: false,
				filterable: false,
				width: 200,
				type: 'string',
				valueGetter: (_value, row) => {
					const user = row.userPerformed;
					return `${user.lastName} ${user.firstName}`;
				},
			},
			{
				field: 'email',
				editable: false,
				sortable: false,
				filterable: false,
				minWidth: 200,
				headerName: t('emailAddress'),
				type: 'string',
				valueGetter: (_value, row) => {
					const user = row.userPerformed;
					return user.email;
				},
			},
			{
				field: 'updatedAt',
				editable: false,
				sortable: false,
				filterable: false,
				minWidth: 200,
				headerName: t('updatedDate'),
				type: 'dateTime',
				valueGetter: (_value, row) => {
					return new Date(row.updatedAt);
				},
			},
		],
		[t],
	);

	return (
		<Stack width={'100%'} spacing={2}>
			{isUpdatingActualDate && <LinearProgress />}
			<Stepper nonLinear activeStep={activeStep} orientation="vertical">
				{phases.map((phase, index) => (
					<Step key={phase.id} completed={phase.isDone}>
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

								<Stack>
									<Typography>
										<strong>{t('personnelPerforms')}:</strong>
									</Typography>
									<CustomDataGrid
										loading={membersQuery.isLoading}
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
										columns={memberCols}
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
								<Typography>
									<strong>{t('plannedStartDate')}:</strong>{' '}
									{parseToDayjs(phase.plannedStartDate)
										.toDate()
										.toLocaleDateString()}
								</Typography>
								<Typography>
									<strong>{t('plannedEndDate')}:</strong>{' '}
									{parseToDayjs(phase.plannedEndDate)
										.toDate()
										.toLocaleDateString()}
								</Typography>
								<Typography>
									<strong>{t('actualStartDate')}:</strong>{' '}
									{phase.actualStartDate
										? parseToDayjs(phase.actualStartDate)
												.toDate()
												.toLocaleDateString()
										: t('notStarted')}
								</Typography>
								<Typography>
									<strong>{t('actualEndDate')}:</strong>{' '}
									{phase.actualEndDate
										? parseToDayjs(phase.actualEndDate)
												.toDate()
												.toLocaleDateString()
										: t('notCompleted')}
								</Typography>
								<Stack spacing={1}>
									<Typography>
										<strong>{t('uploadedFiles')}:</strong>
									</Typography>
									{(attachments.data?.length ?? 0) > 0 ? (
										<AttachmentList attachments={attachments.data ?? []} />
									) : (
										<Typography variant="h6" color="primary">
											{t('noFileUpload')}
										</Typography>
									)}
								</Stack>
							</Stack>

							<Guard requiredRoles={['deployment_person']}>
								<Box sx={{ mb: 2 }}>
									<Button
										variant="contained"
										onClick={() => handleStart(phase.id)}
										sx={{ mt: 1, mr: 1 }}
										disabled={!!phase.actualStartDate}
									>
										{t('start')}
									</Button>
									<Button
										variant="contained"
										onClick={() => handleComplete(phase.id)}
										sx={{ mt: 1, mr: 1 }}
										// disabled={phase.isDone}
									>
										{t('complete')}
									</Button>
								</Box>
							</Guard>
						</StepContent>
					</Step>
				))}
			</Stepper>

			<Guard requiredRoles={['software_admin']}>
				{showCopyrightButton && (
					<Paper square elevation={3} sx={{ p: 1 }}>
						<Box
							sx={{
								p: 2,
								display: 'flex',
								gap: 2,
								alignItems: 'center',
							}}
						>
							<Stack>
								<Typography variant="h6">
									{t('completedAllDeploymentPhase')}
								</Typography>
								<Typography variant="body1">{t('canCreateLicense')}</Typography>
							</Stack>
							<Button
								variant="contained"
								onClick={() => setShowLicenseDialog(true)}
							>
								{t('createLicense')}
							</Button>
						</Box>
					</Paper>
				)}
				<Dialog
					open={showLicenseDialog}
					onClose={() => setShowLicenseDialog(false)}
				>
					<DialogTitle textAlign={'center'}>{t('createLicense')}</DialogTitle>
					<DialogContent>
						<Stack spacing={2} padding={2}>
							<TextField
								fullWidth
								size="medium"
								label={t('licenseDescription')}
								helperText={t('hyperTextVeryLong')}
								value={licenseCreating?.description}
								onChange={(e) => {
									const newValue = e.target.value;
									if (isValidLength(newValue, TextLength.VeryLong))
										setLicenseCreating((pre) => ({
											...pre,
											description: newValue,
										}));
								}}
								placeholder={`${t('enter')} ${t('description').toLowerCase()}...`}
								multiline
								rows={4}
							/>
							<Stack direction={'row'} spacing={2}>
								<DateTimePicker
									disablePast
									label={t('licenseStartTime')}
									value={
										licenseCreating.startTimeMs
											? dayjs(licenseCreating.startTimeMs)
											: undefined
									}
									onChange={(value) => {
										if (!value) return;

										setLicenseCreating((pre) => ({
											...pre,
											startTimeMs: value.valueOf(),
										}));
									}}
								/>
								<DateTimePicker
									label={t('licenseEndTime')}
									minDateTime={
										licenseCreating.startTimeMs
											? dayjs(licenseCreating.startTimeMs)
											: undefined
									}
									value={
										licenseCreating.endTimeMs
											? dayjs(licenseCreating.endTimeMs)
											: undefined
									}
									onChange={(value) => {
										if (!value) return;
										setLicenseCreating((pre) => ({
											...pre,
											endTimeMs: value.valueOf(),
										}));
									}}
								/>
							</Stack>
							<TextField
								required
								id="num-order"
								name="numOrder"
								label={t('expiredAlertIntervalDays')}
								fullWidth
								type="number"
								variant="standard"
								value={licenseCreating?.expireAlertIntervalDay ?? 0}
								onChange={(e) => {
									const numOrder = Number(e.currentTarget.value);
									if (
										!Number.isSafeInteger(numOrder) ||
										numOrder < 0 ||
										numOrder > 100
									)
										return;

									setLicenseCreating((pre) => ({
										...pre,
										expireAlertIntervalDay: numOrder,
									}));
								}}
							/>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowLicenseDialog(false)} color="primary">
							{t('cancel')}
						</Button>
						<Button onClick={handleCreateLicense} color="primary">
							{t('submit')}
						</Button>
					</DialogActions>
				</Dialog>
			</Guard>

			<Typography variant="h6" gutterBottom>
				{t('progressUpdateHistory')}
			</Typography>
			<CustomDataGrid
				loading={
					phaseUpdateHistories.isLoading || phaseUpdateHistories.isFetching
				}
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
					`${row.numOrder}-${row.phase.id}-${row.userPerformed.id}`
				}
				rows={phaseUpdateHistories.data?.content ?? []}
				columns={historyCols}
				rowCount={phaseUpdateHistories.data?.totalElements ?? 0}
				paginationMeta={{ hasNextPage: !phaseUpdateHistories.data?.last }}
				paginationMode="server"
				paginationModel={{
					page: phaseUpdateHistoriesQuery.pageNumber ?? 0,
					pageSize: phaseUpdateHistoriesQuery.pageSize ?? 5,
				}}
				onPaginationModelChange={(model) => {
					setPhaseUpdateHistoriesQuery((prev) => ({
						...prev,
						pageNumber: model.page,
						pageSize: model.pageSize,
					}));
				}}
				pageSizeOptions={[5, 10, 15]}
				filterMode="server"
				onFilterModelChange={(model) => {
					const value = model.items.reduce(
						(acc, item) => {
							if (item.field === 'description') {
								return {
									...acc,
									description: item.value,
								};
							}
							if (item.field === 'phaseType')
								return {
									...acc,
									phaseTypeName: item.value,
								};
							return acc;
						},
						{ description: '', phaseTypeName: '' },
					);
					setPhaseUpdateHistoriesQuery((prev) => ({ ...prev, ...value }));
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

			<Dialog open={openDialog} onClose={handleCancelConfirm}>
				<DialogTitle>{t('confirmDeploymentPhase')}</DialogTitle>
				<DialogContent>
					<Stack spacing={2}>
						<Typography variant="body1">
							{t('confirmCompleteDeploymentPhase')}
						</Typography>
						<Typography variant="subtitle1" mb={1}>
							{t('description')}
						</Typography>
						<Box mb={1}>
							<TextField
								fullWidth
								size="medium"
								helperText={t('hyperTextVeryLong')}
								value={description}
								onChange={(e) => {
									const newValue = e.target.value;
									if (isValidLength(newValue, TextLength.VeryLong))
										setDescripton(newValue);
								}}
								placeholder={`${t('enter')} ${t('description').toLowerCase()}...`}
								multiline
								rows={4}
							/>
						</Box>
						<Typography variant="body1">{t('attachment')}:</Typography>
						<DragAndDropForm onFilesChange={(files) => setAddedFiles(files)} />
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelConfirm} color="primary">
						{t('cancel')}
					</Button>
					<Button
						onClick={handleConfirm}
						loading={loading}
						color="primary"
						autoFocus
					>
						{t('submit')}
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
}

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
					<GridToolbarContainer>
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

function LicenseTab({
	processId,
	phases,
}: {
	processId: number;
	phases: DeploymentPhase[];
}) {
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const userId = useSession()?.user?.id ?? '';
	const [showLicenseDialog, setShowLicenseDialog] = useState(false);
	const showCopyrightButton = useMemo(
		() => phases.every((phase) => phase.isDone),
		[phases],
	);
	const [licenseQuery, setLicenseQuery] =
		useState<GetAllProcessSoftwareLicensesQuery>({
			processId: processId,
			pageNumber: 0,
			pageSize: 5,
		});
	const licenses = useGetAllLicensesByProcessId(licenseQuery!, {
		skip: !licenseQuery,
	});
	useEffect(() => {
		if (licenses.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, licenses.isError, t]);

	const [createLicenseTrigger] = useCreateSoftwareLicense();
	const [licenseCreating, setLicenseCreating] = useState<
		Partial<Omit<SoftwareLicenseCreateRequest, 'userId' | 'processId'>>
	>({});

	const handleCreateLicense = async () => {
		const validate = () => {
			if (!licenseCreating.startTimeMs) {
				notifications.show(t('licenseStartTimeRequire'), {
					severity: 'warning',
					autoHideDuration: HideDuration.fast,
				});
				return false;
			}
			if (!licenseCreating.endTimeMs) {
				notifications.show(t('licenseEndTimeRequire'), {
					severity: 'warning',
					autoHideDuration: HideDuration.fast,
				});
				return false;
			}
			if (!licenseCreating.expireAlertIntervalDay) {
				notifications.show(t('expireAlertIntervalDayRequire'), {
					severity: 'warning',
					autoHideDuration: HideDuration.fast,
				});
				return false;
			}

			return true;
		};
		if (!validate()) return;

		try {
			await createLicenseTrigger({
				userId: userId,
				processId: processId,
				description: licenseCreating.description,
				startTimeMs: licenseCreating.startTimeMs!,
				endTimeMs: licenseCreating.endTimeMs!,
				expireAlertIntervalDay: licenseCreating.expireAlertIntervalDay!,
			});
			notifications.show(t('createLicenseSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
			setShowLicenseDialog(false);
		} catch (error) {
			notifications.show(t('createLicenseError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	const licenseCols: GridColDef<SoftwareLicense>[] = useMemo(
		() => [
			{
				field: 'description',
				headerName: t('description'),
				editable: false,
				sortable: false,

				width: 250,
				type: 'string',
				valueGetter: (_value, row) => {
					return row.description ?? '';
				},
			},
			{
				field: 'startTime',
				headerName: t('licenseStartTime'),
				editable: false,
				sortable: false,
				filterable: false,
				width: 200,
				type: 'string',
				valueGetter: (_value, row) => {
					return row.startTime ?? '';
				},
			},
			{
				field: 'endTime',
				editable: false,
				sortable: false,
				filterable: false,
				minWidth: 200,
				headerName: t('licenseEndTime'),
				type: 'string',
				valueGetter: (_value, row) => {
					return row.endTime ?? '';
				},
			},
			{
				field: 'expireAlertIntervalDay',
				editable: false,
				sortable: false,
				filterable: false,
				minWidth: 200,
				headerName: t('expiredAlertIntervalDays'),
				type: 'number',
				valueGetter: (_value, row) => {
					return `${row.expireAlertIntervalDay ?? ''} ${t('days')}`;
				},
			},
			{
				field: 'createdAt',
				editable: false,
				sortable: false,
				filterable: false,
				minWidth: 200,
				headerName: t('dateCreated'),
				type: 'string',
				valueGetter: (_value, row) => {
					return row.createdAt ?? '';
				},
			},
			{
				field: 'updatedAt',
				editable: false,
				sortable: false,
				filterable: false,
				minWidth: 200,
				headerName: t('updatedDate'),
				type: 'string',
				valueGetter: (_value, row) => {
					return row.updatedAt ?? '';
				},
			},
		],
		[t],
	);

	return (
		<Stack width={'100%'} spacing={2}>
			<Guard requiredRoles={['software_admin']}>
				{showCopyrightButton && (
					<Paper square elevation={3} sx={{ p: 1 }}>
						<Box
							sx={{
								p: 2,
								display: 'flex',
								gap: 2,
								alignItems: 'center',
							}}
						>
							<Stack>
								<Typography variant="h6">
									{t('completedAllDeploymentPhase')}
								</Typography>
								<Typography variant="body1">{t('canCreateLicense')}</Typography>
							</Stack>
							<Button
								variant="contained"
								onClick={() => setShowLicenseDialog(true)}
							>
								{t('createLicense')}
							</Button>
						</Box>
					</Paper>
				)}
				<Dialog
					open={showLicenseDialog}
					onClose={() => setShowLicenseDialog(false)}
				>
					<DialogTitle textAlign={'center'}>{t('createLicense')}</DialogTitle>
					<DialogContent>
						<Stack spacing={2} padding={2}>
							<TextField
								fullWidth
								size="medium"
								label={t('licenseDescription')}
								helperText={t('hyperTextVeryLong')}
								value={licenseCreating?.description}
								onChange={(e) => {
									const newValue = e.target.value;
									if (isValidLength(newValue, TextLength.VeryLong))
										setLicenseCreating((pre) => ({
											...pre,
											description: newValue,
										}));
								}}
								placeholder={`${t('enter')} ${t('description').toLowerCase()}...`}
								multiline
								rows={4}
							/>
							<Stack direction={'row'} spacing={2}>
								<DateTimePicker
									disablePast
									label={t('licenseStartTime')}
									value={
										licenseCreating.startTimeMs
											? dayjs(licenseCreating.startTimeMs)
											: undefined
									}
									onChange={(value) => {
										if (!value) return;

										setLicenseCreating((pre) => ({
											...pre,
											startTimeMs: value.valueOf(),
										}));
									}}
								/>
								<DateTimePicker
									label={t('licenseEndTime')}
									minDateTime={
										licenseCreating.startTimeMs
											? dayjs(licenseCreating.startTimeMs)
											: undefined
									}
									value={
										licenseCreating.endTimeMs
											? dayjs(licenseCreating.endTimeMs)
											: undefined
									}
									onChange={(value) => {
										if (!value) return;
										setLicenseCreating((pre) => ({
											...pre,
											endTimeMs: value.valueOf(),
										}));
									}}
								/>
							</Stack>
							<TextField
								required
								id="num-order"
								name="numOrder"
								label={t('expiredAlertIntervalDays')}
								fullWidth
								type="number"
								variant="standard"
								value={licenseCreating?.expireAlertIntervalDay ?? 0}
								onChange={(e) => {
									const numOrder = Number(e.currentTarget.value);
									if (
										!Number.isSafeInteger(numOrder) ||
										numOrder < 0 ||
										numOrder > 100
									)
										return;

									setLicenseCreating((pre) => ({
										...pre,
										expireAlertIntervalDay: numOrder,
									}));
								}}
							/>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setShowLicenseDialog(false)} color="primary">
							{t('cancel')}
						</Button>
						<Button onClick={handleCreateLicense} color="primary">
							{t('submit')}
						</Button>
					</DialogActions>
				</Dialog>
			</Guard>

			<CustomDataGrid
				loading={licenses.isLoading || licenses.isFetching}
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
					`${row.id}-${row.description}-${row.startTime}-${row.endTime}`
				}
				rows={licenses.data?.content ?? []}
				columns={licenseCols}
				rowCount={licenses.data?.totalElements ?? 0}
				paginationMeta={{ hasNextPage: !licenses.data?.last }}
				paginationMode="server"
				paginationModel={{
					page: licenseQuery.pageNumber ?? 0,
					pageSize: licenseQuery.pageSize ?? 5,
				}}
				onPaginationModelChange={(model) => {
					setLicenseQuery((prev) => ({
						...prev,
						pageNumber: model.page,
						pageSize: model.pageSize,
					}));
				}}
				pageSizeOptions={[5, 10, 15]}
				filterMode="server"
				onFilterModelChange={(model) => {
					const value = model.items.reduce(
						(acc, item) => {
							if (item.field === 'description') {
								return {
									...acc,
									description: item.value,
								};
							}
							if (item.field === 'phaseType')
								return {
									...acc,
									phaseTypeName: item.value,
								};
							return acc;
						},
						{ description: '', phaseTypeName: '' },
					);
					setLicenseQuery((prev) => ({ ...prev, ...value }));
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
						<Tab label={t('licenseList')} {...a11yProps(3)} />
					</Tabs>
				</Box>
				<CustomTabPanel value={value} index={0}>
					<PhaseTab
						processId={Number(processId)}
						phases={phasesQuery.data ?? []}
					/>
				</CustomTabPanel>
				<CustomTabPanel value={value} index={1}>
					<ModuleTab processId={Number(processId)} />
				</CustomTabPanel>
				<CustomTabPanel value={value} index={2}>
					<PersonnelTab processId={Number(processId)} />
				</CustomTabPanel>
				<CustomTabPanel value={value} index={3}>
					<LicenseTab
						processId={Number(processId)}
						phases={phasesQuery.data ?? []}
					/>
				</CustomTabPanel>
			</Box>
		</Container>
	);
};

export default DeploymentProcessDetailPage;
