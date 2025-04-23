import {
	Typography,
	Paper,
	Stack,
	Box,
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	AttachmentList,
	CustomDataGrid,
	DragAndDropForm,
	Guard,
} from '../../components';
import {
	convertToAPIDateFormat,
	HideDuration,
	isValidLength,
	parseToDayjs,
	TextLength,
} from '../../utils';
import {
	useCreateFile,
	useCreateSoftwareLicense,
	useGetAllPhaseAttachments,
	useGetDeploymentPhaseMembers,
	useGetDeploymentPhaseUpdateHistories,
	useUpdateDeploymentPhaseActualDates,
	useUpdateDeploymentPhaseAttachment,
} from '../../services';
import { useNotifications, useSession } from '@toolpad/core';
import {
	getGridStringOperators,
	GridColDef,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function PhaseTab({
	process,
	phases,
}: {
	process: {
		id: number;
		status: DeploymentProcessStatus;
	};
	phases: DeploymentPhase[];
}) {
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const userId = useSession()?.user?.id ?? '';
	const [activeStep, setActiveStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const showCopyrightButton = useMemo(
		() => phases.every((phase) => phase.isDone) && process.status === 'DONE',
		[phases, process.status]
	);
	const [showLicenseDialog, setShowLicenseDialog] = useState(false);
	const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
	const [description, setDescripton] = useState<string | null>(null);
	useEffect(() => {
		setSelectedPhaseId(phases[activeStep]?.id);
	}, [activeStep, phases]);

	const membersQuery = useGetDeploymentPhaseMembers(selectedPhaseId!, {
		skip: !selectedPhaseId,
	});
	const hasModifyingPermission = useMemo(() => {
		return (
			(membersQuery.data?.some((member) => member.id === userId) ?? false) &&
			process.status === 'IN_PROGRESS'
		);
	}, [membersQuery.data, process.status, userId]);
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
		[t]
	);

	const [updateActualDateTrigger, { isLoading: isUpdatingActualDate }] =
		useUpdateDeploymentPhaseActualDates();
	const updateActualHandler = useCallback(
		async (
			request: DeploymentPhaseUpdateActualDatesRequest,
			successText: string,
			errorText: string
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
		[notifications, updateActualDateTrigger]
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
				description: t('start'),
				actualStartDate: currentTime,
				actualEndDate: null,
				updatedByUserId: userId,
			},
			t('updateDeploymentPhaseActualStartDateSuccess'),
			t('updateDeploymentPhaseActualStartDateError')
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
					})
				);
				await Promise.all(
					fileIds.map((fileId) =>
						updateAttachmentTrigger({
							phaseId: selectedPhaseId,
							attachmentId: fileId,
							operator: 'ADD',
						}).unwrap()
					)
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
			t('updateDeploymentPhaseActualEndDateError')
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
				processId: process.id,
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

	const [phaseUpdateHistoriesQuery, setPhaseUpdateHistoriesQuery] =
		useState<GetAllDeploymentPhaseUpdateHistoriesQuery>({
			processId: process.id,
			pageNumber: 0,
			pageSize: 5,
		});
	const phaseUpdateHistories = useGetDeploymentPhaseUpdateHistories(
		phaseUpdateHistoriesQuery
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
				filterOperators: getGridStringOperators().filter(
					(operator) => operator.value === 'contains'
				),
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
				filterOperators: getGridStringOperators().filter(
					(operator) => operator.value === 'contains'
				),
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
			{
				field: 'isDone',
				editable: false,
				sortable: false,
				filterable: false,
				minWidth: 200,
				headerName: t('status'),
				type: 'string',
				valueGetter: (value: boolean) => {
					return value ? t('completed') : t('notCompleted');
				},
			},
		],
		[t]
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
								{hasModifyingPermission && (
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
											disabled={phase.isDone || !phase.actualStartDate}
										>
											{t('complete')}
										</Button>
									</Box>
								)}
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
						{ description: '', phaseTypeName: '' }
					);
					setPhaseUpdateHistoriesQuery((prev) => ({ ...prev, ...value }));
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
								value={description ?? ''}
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
