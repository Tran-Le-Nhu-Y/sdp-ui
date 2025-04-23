import {
	Stack,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Tooltip,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomDataGrid, Guard } from '../../components';
import { useNavigate } from 'react-router-dom';
import {
	HideDuration,
	isValidLength,
	PathHolders,
	RoutePaths,
	TextLength,
} from '../../utils';
import {
	useCreateSoftwareLicense,
	useGetAllLicensesByProcessId,
	useUpdateSoftwareLicense,
} from '../../services';
import { useNotifications, useSession } from '@toolpad/core';
import {
	GridActionsCellItem,
	GridColDef,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';

export default function LicenseTab({
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
	const navigate = useNavigate();
	const notifications = useNotifications();
	const userId = useSession()?.user?.id ?? '';
	const [showCreateLicenseDialog, setShowCreateLicenseDialog] = useState(false);
	const [showUpdateLicenseDialog, setShowUpdateLicenseDialog] = useState(false);
	const showCopyrightButton = useMemo(
		() => phases.every((phase) => phase.isDone) && process.status === 'DONE',
		[phases, process.status]
	);
	const [licenseQuery, setLicenseQuery] =
		useState<GetAllProcessSoftwareLicensesQuery>({
			processId: process.id,
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
			setShowCreateLicenseDialog(false);
		} catch (error) {
			notifications.show(t('createLicenseError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	const [licenseEditing, setLicenseEditing] =
		useState<SoftwareLicenseUpdateRequest>();
	const [updateLicenseTrigger, { isLoading: isUpdatingLicense }] =
		useUpdateSoftwareLicense();

	const handleEditLicense = (params: SoftwareLicense) => {
		const license = params;
		const licenseId = params.id;
		setLicenseEditing({
			licenseId: licenseId,
			description: license.description,
			expireAlertIntervalDay: license.expireAlertIntervalDay,
		});

		setShowUpdateLicenseDialog(true);
	};

	const updateLicenseHandler = useCallback(
		async (
			request: SoftwareLicenseUpdateRequest,
			successText: string,
			errorText: string
		) => {
			try {
				await updateLicenseTrigger(request).unwrap();

				notifications.show(successText, {
					severity: 'success',
					autoHideDuration: HideDuration.fast,
				});
				setShowUpdateLicenseDialog(false);
			} catch (error) {
				console.error(error);
				notifications.show(errorText, {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
			}
		},
		[notifications, updateLicenseTrigger]
	);

	const licenseCols: GridColDef<SoftwareLicense>[] = useMemo(
		() => [
			{
				field: 'description',
				headerName: t('description'),
				editable: false,
				sortable: false,
				filterable: false,
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
				width: 200,
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
				width: 200,
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
				width: 200,
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
				width: 200,
				headerName: t('updatedDate'),
				type: 'string',
				valueGetter: (_value, row) => {
					return row.updatedAt ?? '';
				},
			},
			{
				field: 'actions',
				headerName: t('action'),
				type: 'actions',
				width: 80,
				getActions: (params) => [
					<GridActionsCellItem
						icon={
							<Tooltip title={t('seeDetail')}>
								<RemoveRedEyeIcon color="info" />
							</Tooltip>
						}
						color="success"
						label={t('seeDetail')}
						onClick={() => {
							const licenseId = params.id.toString();
							navigate(
								RoutePaths.SOFTWARE_LICENSE_DETAIL.replace(
									`:${PathHolders.SOFTWARE_LICENSE_ID}`,
									licenseId
								)
							);
						}}
					/>,
					<GridActionsCellItem
						icon={
							<Tooltip title={t('edit')}>
								<EditIcon color="info" />
							</Tooltip>
						}
						color="success"
						label={t('edit')}
						onClick={() => {
							handleEditLicense(params.row);
						}}
					/>,
				],
			},
		],
		[t, navigate]
	);

	return (
		<Stack width={'100%'} spacing={2}>
			<Guard requiredRoles={['software_admin']}>
				{showCopyrightButton && (
					<Stack direction={'row'} justifyContent={'flex-end'}>
						<Button
							variant="contained"
							onClick={() => setShowCreateLicenseDialog(true)}
						>
							{t('createLicense')}
						</Button>
					</Stack>
				)}
				<Dialog
					open={showCreateLicenseDialog}
					onClose={() => setShowCreateLicenseDialog(false)}
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
						<Button
							onClick={() => setShowCreateLicenseDialog(false)}
							color="primary"
						>
							{t('cancel')}
						</Button>
						<Button onClick={handleCreateLicense} color="primary">
							{t('submit')}
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={showUpdateLicenseDialog}
					onClose={() => setShowUpdateLicenseDialog(false)}
				>
					<DialogTitle textAlign={'center'}>{t('updateLicense')}</DialogTitle>
					<DialogContent>
						<Stack width={'450px'} spacing={2} padding={3}>
							<TextField
								fullWidth
								size="medium"
								label={t('licenseDescription')}
								helperText={t('hyperTextVeryLong')}
								value={licenseEditing?.description}
								onChange={(e) => {
									const newValue = e.target.value;
									if (isValidLength(newValue, TextLength.VeryLong))
										setLicenseEditing((pre) => ({
											...pre!,
											description: newValue,
										}));
								}}
								placeholder={`${t('enter')} ${t('description').toLowerCase()}...`}
								multiline
								rows={4}
							/>

							<TextField
								required
								id="num-order"
								name="numOrder"
								label={t('expiredAlertIntervalDays')}
								fullWidth
								type="number"
								variant="standard"
								value={licenseEditing?.expireAlertIntervalDay ?? 0}
								onChange={(e) => {
									const numOrder = Number(e.currentTarget.value);
									if (
										!Number.isSafeInteger(numOrder) ||
										numOrder < 0 ||
										numOrder > 100
									)
										return;

									setLicenseEditing((pre) => ({
										...pre!,
										expireAlertIntervalDay: numOrder,
									}));
								}}
							/>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => setShowUpdateLicenseDialog(false)}
							color="primary"
						>
							{t('cancel')}
						</Button>
						<Button
							onClick={() => {
								if (!licenseEditing) return;
								updateLicenseHandler(
									{
										licenseId: licenseEditing.licenseId!,
										description: licenseEditing.description!,
										expireAlertIntervalDay:
											licenseEditing.expireAlertIntervalDay!,
									},
									t('updateLicenseSuccess'),
									t('updateLicenseError')
								);
							}}
							color="primary"
						>
							{t('submit')}
						</Button>
					</DialogActions>
				</Dialog>
			</Guard>
			<CustomDataGrid
				loading={licenses.isLoading || licenses.isFetching || isUpdatingLicense}
				slots={{
					toolbar: () => (
						<GridToolbarContainer>
							<GridToolbarDensitySelector />
							<GridToolbarColumnsButton />
						</GridToolbarContainer>
					),
				}}
				getRowId={(row) => row.id}
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
			/>
		</Stack>
	);
}
