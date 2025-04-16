import {
	Stack,
	LinearProgress,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Tooltip,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomDataGrid } from '../../components';
import { useNavigate } from 'react-router-dom';
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
} from '../../services';
import { useNotifications, useSession } from '@toolpad/core';
import {
	GridActionsCellItem,
	GridColDef,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

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
					<CustomDataGrid
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

export default function PhaseTab({
	processId,
	editable = true,
}: {
	processId: number;
	editable?: boolean;
}) {
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
				getActions: (params) => {
					const readElm = (
						<GridActionsCellItem
							icon={
								<Tooltip title={t('seeDetail')}>
									<RemoveRedEyeIcon color="primary" />
								</Tooltip>
							}
							label={t('seeDetail')}
							onClick={() => {
								const phaseId = params.id.toString();
								const path = RoutePaths.DEPLOYMENT_PHASE.replace(
									`:${PathHolders.DEPLOYMENT_PROCESS_ID}`,
									`${processId}`
								).replace(`:${PathHolders.DEPLOYMENT_PHASE_ID}`, phaseId);
								navigate(path);
							}}
						/>
					);
					const editElm = (
						<GridActionsCellItem
							icon={
								<Tooltip title={t('edit')}>
									<EditIcon color="primary" />
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
						/>
					);
					const deleteElm = (
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
						/>
					);

					return editable ? [editElm, deleteElm] : [readElm];
				},
			},
		],
		[deletePhaseTrigger, editable, navigate, notifications, processId, t]
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
			</Stack>
		</>
	);
}
